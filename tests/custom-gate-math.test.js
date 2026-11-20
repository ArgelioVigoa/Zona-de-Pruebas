'use strict';
const assert=require('node:assert/strict');
const C=(r=0,i=0)=>[r,i], add=(a,b)=>C(a[0]+b[0],a[1]+b[1]), mul=(a,b)=>C(a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]), conj=a=>C(a[0],-a[1]), abs=a=>Math.hypot(a[0],a[1]);
const mm=(a,b)=>a.map(r=>b[0].map((_,j)=>r.reduce((s,x,k)=>add(s,mul(x,b[k][j])),C())));
const dag=a=>a[0].map((_,j)=>a.map(r=>conj(r[j])));
const valid=m=>{const p=mm(dag(m),m);let e=0;for(let i=0;i<m.length;i++)for(let j=0;j<m.length;j++){const z=p[i][j];e=Math.max(e,abs(C(z[0]-(i===j?1:0),z[1])))}return e<1e-10};
const I=n=>Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>C(i===j?1:0)));
const h=1/Math.sqrt(2);
const gates={
 H:[[C(h),C(h)],[C(h),C(-h)]],X:[[C(0),C(1)],[C(1),C(0)]],
 Y:[[C(0),C(0,-1)],[C(0,1),C(0)]],Z:[[C(1),C(0)],[C(0),C(-1)]],
 S:[[C(1),C(0)],[C(0,1),C(0)]],T:[[C(1),C(0)],[C(0),C(h,h)]]
};
for(const [name,m] of Object.entries(gates)){assert.equal(valid(m),true,name+' must be unitary')}
const kron=(a,b)=>a.flatMap(ar=>b.map(br=>ar.flatMap(x=>br.map(y=>mul(x,y)))));
const cx=I(4);for(let x=0;x<4;x++){const y=((x&1)!==0)?x^2:x;cx[y][x]=C(1);if(y!==x)cx[x][x]=C(0)}
const cz=I(4);cz[3][3]=C(-1);
const sw=I(4);sw[1][1]=C(0);sw[2][2]=C(0);sw[1][2]=C(1);sw[2][1]=C(1);
assert.equal(valid(cx),true,'CNOT must be unitary');
assert.equal(valid(cz),true,'CZ must be unitary');
assert.equal(valid(sw),true,'SWAP must be unitary');
assert.equal(valid(kron(I(2),gates.H)),true,'q0 LSB tensor embedding must be unitary');
assert.equal(valid([[C(1),C(0)],[C(0),C(2)]]),false,'non-unitary matrix must be rejected');
console.log('Custom gate matrix regression tests passed.');
