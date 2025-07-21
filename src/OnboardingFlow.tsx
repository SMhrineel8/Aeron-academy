import React, { useEffect, useRef } from 'react';
import SageMascot from './SageMascot';

export default function OnboardingFlow({
  step, setStep, profile, setProfile, finish
}: {
  step: number,
  setStep: (n:number)=>void,
  profile: any,
  setProfile: any,
  finish: ()=>void
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(()=>{
    if(step===1 && nameRef.current) nameRef.current.focus();
  },[step]);

  const steps = [
    {
      title:"Welcome to Learnly!",
      subtitle:"Unlock your potential",
      content:(
        <>
          <SageMascot state="excited" message="Hi, I’m Eagle—your mentor!" inline/>
          <input
            ref={nameRef}
            type="text"
            placeholder="What's your name?"
            className="w-full p-4 rounded-xl border"
            value={profile.name}
            onChange={e=>setProfile({...profile,name:e.target.value})}
            onFocus={e=>e.currentTarget.select()}
          />
        </>
      )
    },
    // steps 2–5 original content...
  ];

  const cur = steps[step-1];
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{cur.title}</h1>
          <p className="text-gray-600">{cur.subtitle}</p>
        </div>
        <div className="space-y-6">{cur.content}</div>
        <div className="flex justify-between mt-8">
          <button
            onClick={()=>setStep(Math.max(1,step-1))}
            disabled={step===1}
            className="px-4 py-2 rounded bg-gray-100 disabled:opacity-50"
          >Back</button>
          <button
            onClick={()=> step===5 ? finish() : setStep(step+1)}
            className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >{step===5?'Start':'Next'}</button>
        </div>
      </div>
    </div>
  );
}
