from pathlib import Path
import json,math,hashlib
root=Path(__file__).resolve().parent.parent
manifest=json.loads((root/'data/manifest.json').read_text());assert len(manifest)==33
count=0;worst=0;layers=0
for entry in manifest:
 path=root/'data'/entry['file'];assert hashlib.sha256(path.read_bytes()).hexdigest()==entry['sha256']
 data=json.loads(path.read_text());assert len(data['frames'])==entry['frames']
 for g in data['geometry']:
  assert all(math.isfinite(v) for v in [g['x'],g['y'],g['w'],g['h']]+g['origin'])
  for c in g['chars']:assert math.isfinite(c['x']) and math.isfinite(c['y'])
 for frame in data['frames']:
  count+=1
  for r in frame:
   layers+=1;a,b,c,d,tx,ty=r['m'];assert all(math.isfinite(v) for v in r['m']);assert 0<=r['opacity']<=1.001
   v=.5*math.atan2(2*(a*c+b*d),a*a+b*b-c*c-d*d);cv,sv=math.cos(v),math.sin(v);x,y=a*cv+c*sv,b*cv+d*sv;s1=math.hypot(x,y);s2=(a*d-b*c)/s1 if s1>1e-10 else 0;u=math.atan2(y,x) if s1>1e-10 else 0;cu,su=math.cos(u),math.sin(u)
   recovered=[cu*s1*cv+su*s2*sv,su*s1*cv-cu*s2*sv,cu*s1*sv-su*s2*cv,su*s1*sv+cu*s2*cv]
   error=max(abs(p-q) for p,q in zip([a,b,c,d],recovered));worst=max(worst,error);assert error<1e-5,error
result={'presets':len(manifest),'frames':count,'layerPoses':layers,'maximumAffineError':worst,'AEExecuted':False,'visualParityVerified':False}
(root/'validation/results.json').write_text(json.dumps(result,indent=2));print(result)
