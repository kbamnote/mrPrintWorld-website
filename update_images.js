const fs = require('fs');

function updateImages(file, imageMap, matchBySlug) {
  let content = fs.readFileSync(file, 'utf8');
  let blocks = content.split(/(\{[\s\S]*?\})/g);
  for (let i = 0; i < blocks.length; i++) {
    if (i % 2 !== 0) {
      let block = blocks[i];
      let match = block.match(/id:\s*'([^']+)'/) || block.match(/slug:\s*'([^']+)'/);
      if (match) {
        let key = matchBySlug ? (block.match(/slug:\s*'([^']+)'/)?.[1] || match[1]) : match[1];
        if (imageMap[key]) {
          block = block.replace(/image:\s*'[^']+'/, `image: '${imageMap[key]}'`);
          blocks[i] = block;
        } else {
            let slugMatch = block.match(/slug:\s*'([^']+)'/);
            if(slugMatch && imageMap[slugMatch[1]]) {
                block = block.replace(/image:\s*'[^']+'/, `image: '${imageMap[slugMatch[1]]}'`);
                blocks[i] = block;
            }
        }
      }
    }
  }
  fs.writeFileSync(file, blocks.join(''));
}

const servicesMap = {
  'printing': 'https://images.unsplash.com/photo-1562654357-e8622b79412f?auto=format&fit=crop&w=600&q=80',
  'signage': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  'corporate-solutions': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
  'fabrication': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
  'event-branding': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80',
  'laser-cutting': 'https://images.unsplash.com/photo-1618090584126-129cd1f3fbaa?auto=format&fit=crop&w=600&q=80',
  'cnc-cutting': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
  'metal-marking': 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80',
  'uv-printing': 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80',
  'diy-craft': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
  'acrylic-creations': 'https://images.unsplash.com/photo-1635887256567-27b9c9f69741?auto=format&fit=crop&w=600&q=80',
  'interior-solutions': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
};
updateImages('src/data/services.js', servicesMap, true);

const productsMap = {
  'premium-business-cards': 'https://images.unsplash.com/photo-1589330272124-25509e8601c6?auto=format&fit=crop&w=600&q=80',
  'corporate-letterheads': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
  'brochures-catalogues': 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=600&q=80',
  'presentation-folders': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
  'mementos-trophies': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
  'executive-gift-sets': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
  'branded-apparel': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
  'acrylic-name-plates': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
  'acrylic-led-signs': 'https://images.unsplash.com/photo-1635887256567-27b9c9f69741?auto=format&fit=crop&w=600&q=80',
  'acrylic-table-tops': 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80',
  'glow-sign-boards': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  'acp-sign-boards': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  'dealer-boards': 'https://images.unsplash.com/photo-1605051827605-645621458925?auto=format&fit=crop&w=600&q=80',
  'led-sign-boards': 'https://images.unsplash.com/photo-1635887256567-27b9c9f69741?auto=format&fit=crop&w=600&q=80',
  'flex-banners': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80',
  'vinyl-stickers': 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=600&q=80',
  'posters-canvas': 'https://images.unsplash.com/photo-1603482730303-3165b4c42023?auto=format&fit=crop&w=600&q=80',
  'rollup-standees': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
  'promotional-canopies': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
  'promotional-pens': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
  'custom-box-packaging': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
  'custom-merchandise': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
  'laser-cut-nameplates': 'https://images.unsplash.com/photo-1618090584126-129cd1f3fbaa?auto=format&fit=crop&w=600&q=80',
  'laser-cut-mdf-art': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
  'cnc-carved-signage': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
  'cnc-cut-letters': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
  'uv-printed-plaques': 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80',
  'uv-printed-keychains': 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80',
  'wall-cladding-panels': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  'custom-murals': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  'canvas-photo-prints': 'https://images.unsplash.com/photo-1603482730303-3165b4c42023?auto=format&fit=crop&w=600&q=80'
};
updateImages('src/data/products.js', productsMap, true);

function updatePortfolio(file, imageMap) {
  let content = fs.readFileSync(file, 'utf8');
  let blocks = content.split(/(\{[\s\S]*?\})/g);
  for (let i = 0; i < blocks.length; i++) {
    if (i % 2 !== 0) {
      let block = blocks[i];
      let match = block.match(/slug:\s*'([^']+)'/);
      if (match) {
        let key = match[1];
        if (imageMap[key]) {
          if (block.includes('image: null')) {
             block = block.replace(/image:\s*null/, `image: '${imageMap[key]}'`);
          } else if (block.includes('image:')) {
             block = block.replace(/image:\s*'[^']*'/, `image: '${imageMap[key]}'`);
          }
          blocks[i] = block;
        }
      }
    }
  }
  fs.writeFileSync(file, blocks.join(''));
}

const portfolioMap = {
  'acrylic-retail-flagship': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  'multi-store-rollout': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
  'annual-report-print': 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=600&q=80',
  'acp-facade': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
  'glow-sign-network': 'https://images.unsplash.com/photo-1605051827605-645621458925?auto=format&fit=crop&w=600&q=80',
  'corporate-gifting': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
  'arch-gate-event': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80'
};
updatePortfolio('src/data/portfolio.js', portfolioMap);
console.log('Update complete!');
