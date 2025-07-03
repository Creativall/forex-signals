import React from 'react';
import Grid from '@mui/material/Grid';

/**
 * Componente para layout responsivo de 4 cards
 * 
 * Breakpoints:
 * - Desktop (md ≥ 900px): 4 cards por linha
 * - Tablet (sm 600–900px): 2 cards por linha  
 * - Mobile (xs < 600px): 1 card por linha
 * 
 * @param {Array} items - Array de 4 elementos para renderizar
 * @param {Function} renderCard - Função que recebe (item, index) e retorna o JSX do card
 * @param {Object} spacing - Spacing customizado { xs, sm, md }
 * @param {Object} containerProps - Props adicionais para o Grid container
 */
const ResponsiveCardGrid = ({ 
  items = [], 
  renderCard, 
  spacing = { xs: 1, sm: 2, md: 2 },
  containerProps = {} 
}) => {
  return (
    <Grid 
      container 
      spacing={spacing}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ 
        width: '100%', 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'stretch',
        alignItems: 'stretch',
        ...containerProps.sx
      }}
      {...containerProps}
    >
      {items.map((item, index) => (
        <Grid 
          size={{ xs: 12, sm: 6, md: 3 }}  /* Grid v2: definir tamanhos responsivos */
          key={item.id || index} 
          sx={{ 
            display: 'flex', 
            flex: 1, 
            minWidth: 0,
            width: '100%'
          }}
        >
          {renderCard(item, index)}
        </Grid>
      ))}
    </Grid>
  );
};

export default ResponsiveCardGrid;

// Exemplo de uso:
// 
// const cards = [
//   { id: 1, title: 'Card 1', content: 'Conteúdo 1' },
//   { id: 2, title: 'Card 2', content: 'Conteúdo 2' },
//   { id: 3, title: 'Card 3', content: 'Conteúdo 3' },
//   { id: 4, title: 'Card 4', content: 'Conteúdo 4' }
// ];
//
// <ResponsiveCardGrid 
//   items={cards}
//   renderCard={(card, index) => (
//     <Card sx={{ width: '100%', height: '100%' }}>
//       <CardContent>
//         <Typography variant="h6">{card.title}</Typography>
//         <Typography>{card.content}</Typography>
//       </CardContent>
//     </Card>
//   )}
//   spacing={{ xs: 1, sm: 2, md: 3 }}
//   containerProps={{ sx: { mb: 3 } }}
// /> 