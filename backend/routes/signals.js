const express = require('express');
const router = express.Router();
const { supabase } = require('../database');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Middleware para verificar autenticação
const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token de acesso necessário' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido' });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('❌ Erro na autenticação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// =====================================================
// CRIAR NOVO SINAL
// =====================================================
router.post('/', authenticateUser, async (req, res) => {
  try {
    const {
      pair,
      direction,
      timeframe,
      entry_time,
      expiration_time,
      amount,
      probability
    } = req.body;

    // Validações básicas
    if (!pair || !direction || !timeframe || !entry_time || !expiration_time) {
      return res.status(400).json({
        error: 'Campos obrigatórios: pair, direction, timeframe, entry_time, expiration_time'
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
        user_id: req.user.id,
        pair,
        direction,
        timeframe,
        entry_time,
        expiration_time,
        amount: amount || null,
        probability: probability || null,
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
      signal: data
    });

  } catch (error) {
    console.error('❌ Erro ao criar sinal:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =====================================================
// LISTAR SINAIS DO USUÁRIO
// =====================================================
router.get('/', authenticateUser, async (req, res) => {
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
      .select('*')
      .eq('user_id', req.user.id);

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
// BUSCAR SINAL POR ID
// =====================================================
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('forex_signals')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
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
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Remover campos que não devem ser atualizados
    delete updateData.id;
    delete updateData.user_id;
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
      .eq('user_id', req.user.id)
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
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('forex_signals')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

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
router.get('/stats/summary', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('forex_signals')
      .select('result, amount, profit_loss')
      .eq('user_id', req.user.id);

    if (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }

    const stats = {
      total: data.length,
      pending: data.filter(s => s.result === 'PENDING').length,
      wins: data.filter(s => s.result === 'WIN').length,
      losses: data.filter(s => s.result === 'LOSS').length,
      winRate: 0,
      totalProfit: 0
    };

    const finalized = stats.wins + stats.losses;
    if (finalized > 0) {
      stats.winRate = Math.round((stats.wins / finalized) * 100);
    }

    stats.totalProfit = data.reduce((sum, signal) => {
      return sum + (parseFloat(signal.profit_loss) || 0);
    }, 0);

    res.json({ stats });

  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 