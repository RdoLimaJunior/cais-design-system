/**
 * Faixas de tela do ecossistema CAIS (as mesmas do globals.css e da página Fundamentos / Responsividade).
 * A largura de cada uma fica dentro da faixa: 375 (mobile), 768 (tablet), 1280 (desktop pequeno),
 * 1536 e 1920 (telas grandes).
 */
export const VIEWPORTS_DO_ECOSSISTEMA = {
  mobile: { name: 'Mobile (375 px)', styles: { width: '375px', height: '812px' }, type: 'mobile' },
  tablet: { name: 'Tablet (768 px)', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
  desktopPequeno: { name: 'Desktop pequeno (1280 px)', styles: { width: '1280px', height: '720px' }, type: 'desktop' },
  telaGrande: { name: 'Tela grande (1536 px)', styles: { width: '1536px', height: '864px' }, type: 'desktop' },
  telaExtraGrande: {
    name: 'Tela extra grande (1920 px)',
    styles: { width: '1920px', height: '1080px' },
    type: 'desktop',
  },
}
