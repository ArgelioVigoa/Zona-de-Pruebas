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
 S:[[C(1),C(0)],[C(0),C(0,1)]],T:[[C(1),C(0)],[C(0),C(h,h)]]
};
for(const [name,m] of Object.entries(gates)){assert.equal(valid(m),true,name+' must be unitary')}
const kron=(a,b)=>a.flatMap(ar=>b.map(br=>ar.flatMap(x=>br.map(y=>mul(x,y)))));
const cx=I(4);for(let x=0;x<4;x++){const y=((x&1)!==0)?x^2:x;cx[y][x]=C(1);if(y!==x)cx[x][x]=C(0)}
function twoQ(id,q,q2){const m=Array.from({length:4},()=>Array.from({length:4},()=>C(0)));for(let x=0;x<4;x++){let y=x,phase=1;if(id==='CX'&&((x>>q)&1))y=x^(1<<q2);else if(id==='CZ'&&((x>>q)&1)&&((x>>q2)&1))phase=-1;else if(id==='SWAP'){const a=(x>>q)&1,b=(x>>q2)&1;if(a!==b)y=x^(1<<q)^(1<<q2)}m[y][x]=C(phase)}return m}
const cz=twoQ('CZ',0,1),sw=twoQ('SWAP',0,1),cxBuilt=twoQ('CX',0,1);
assert.equal(valid(cx),true,'CNOT test reference must be unitary');
assert.equal(valid(cxBuilt),true,'constructed CNOT must be unitary');
assert.equal(valid(cz),true,'CZ must be unitary');
assert.equal(valid(sw),true,'SWAP must be unitary');
assert.equal(cz[3][3][0],-1,'constructed CZ must apply the controlled phase');
assert.equal(cxBuilt[3][1][0],1,'CNOT must map |01> to |11> when q0 controls q1');
assert.equal(cxBuilt[1][1][0],0,'CNOT must not leave the control-one basis state unchanged');
assert.equal(sw[2][1][0],1,'SWAP must exchange |01> and |10>');
assert.equal(valid(kron(I(2),gates.H)),true,'q0 LSB tensor embedding must be unitary');
assert.equal(valid([[C(1),C(0)],[C(0),C(2)]]),false,'non-unitary matrix must be rejected');
console.log('Custom gate matrix regression tests passed.');
