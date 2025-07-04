const express = require('express');
const router = express.Router();
const { supabase } = require('../database');

// =====================================================
// LISTAR TODOS OS SINAIS (sem autenticação por enquanto)
// =====================================================
router.get('/', async (req, res) => {
  try {
    const { 
      limit = 20, 
      offset = 0,
      result,
      pair,
      order = 'created_at',
      direction = 'desc'
    } = req.query;

    let query = supabase
      .from('forex_signals')
      .select('*');

    // Filtros opcionais
    if (result) {
      query = query.eq('result', result.toUpperCase());
    }
    
    if (pair) {
      query = query.eq('pair', pair.toUpperCase());
    }

    // Ordenação e paginação
    query = query
      .order(order, { ascending: direction === 'asc' })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Erro ao buscar sinais:', error);
      return res.status(500).json({ error: 'Erro ao buscar sinais' });
    }

    res.json({
      signals: data || [],
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('❌ Erro ao listar sinais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================================
// CRIAR NOVO SINAL
// =====================================================
router.post('/', async (req, res) => {
  try {
    const {
      pair,
      direction,
      entry_time,
      expiry_time,
      entry_value,
      payout
    } = req.body;

    // Validações básicas
    if (!pair || !direction || !entry_time || !expiry_time) {
      return res.status(400).json({
        error: 'Campos obrigatórios: pair, direction, entry_time, expiry_time'
      });
    }

    if (!['CALL', 'PUT'].includes(direction)) {
      return res.status(400).json({
        error: 'Direction deve ser CALL ou PUT'
      });
    }

    const { data, error } = await supabase
      .from('forex_signals')
      .insert([{
        pair,
        direction,
        entry_time,
        expiry_time,
        entry_value: entry_value || null,
        payout: payout || null,
        result: 'PENDING'
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar sinal:', error);
      return res.status(500).json({ error: 'Erro ao salvar sinal' });
    }

    console.log('✅ Sinal criado:', data.id);
    res.status(201).json({
      message: 'Sinal criado com sucesso',
      signal: data,
      success: true
    });

  } catch (error) {
    console.error('❌ Erro ao criar sinal:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================================
// BUSCAR SINAL POR ID
// =====================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('forex_signals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Sinal não encontrado' });
      }
      console.error('❌ Erro ao buscar sinal:', error);
      return res.status(500).json({ error: 'Erro ao buscar sinal' });
    }

    res.json({ signal: data });

  } catch (error) {
    console.error('❌ Erro ao buscar sinal:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================================
// ATUALIZAR SINAL
// =====================================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remover campos que não devem ser atualizados
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;

    // Validar direction se fornecido
    if (updateData.direction && !['CALL', 'PUT'].includes(updateData.direction)) {
      return res.status(400).json({
        error: 'Direction deve ser CALL ou PUT'
      });
    }

    // Validar result se fornecido
    if (updateData.result && !['WIN', 'LOSS', 'PENDING'].includes(updateData.result)) {
      return res.status(400).json({
        error: 'Result deve ser WIN, LOSS ou PENDING'
      });
    }

    const { data, error } = await supabase
      .from('forex_signals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Sinal não encontrado' });
      }
      console.error('❌ Erro ao atualizar sinal:', error);
      return res.status(500).json({ error: 'Erro ao atualizar sinal' });
    }

    console.log('✅ Sinal atualizado:', data.id);
    res.json({
      message: 'Sinal atualizado com sucesso',
      signal: data
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar sinal:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================================
// DELETAR SINAL
// =====================================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('forex_signals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Erro ao deletar sinal:', error);
      return res.status(500).json({ error: 'Erro ao deletar sinal' });
    }

    console.log('✅ Sinal deletado:', id);
    res.json({ message: 'Sinal deletado com sucesso' });

  } catch (error) {
    console.error('❌ Erro ao deletar sinal:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================================
// ESTATÍSTICAS DOS SINAIS
// =====================================================
router.get('/stats/summary', async (req, res) => {
  try {
    // Buscar todos os sinais
    const { data: allSignals, error: allError } = await supabase
      .from('forex_signals')
      .select('result, payout');

    if (allError) {
      console.error('❌ Erro ao buscar estatísticas:', allError);
      return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }

    // Calcular estatísticas
    const total = allSignals.length;
    const wins = allSignals.filter(s => s.result === 'WIN').length;
    const losses = allSignals.filter(s => s.result === 'LOSS').length;
    const pending = allSignals.filter(s => s.result === 'PENDING').length;
    
    const winRate = total > 0 ? ((wins / (wins + losses)) * 100).toFixed(1) : 0;
    const totalPayout = allSignals
      .filter(s => s.result === 'WIN')
      .reduce((sum, s) => sum + (parseFloat(s.payout) || 0), 0);

    res.json({
      total,
      wins,
      losses,
      pending,
      winRate: parseFloat(winRate),
      totalPayout: parseFloat(totalPayout.toFixed(2))
    });

  } catch (error) {
    console.error('❌ Erro ao calcular estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 