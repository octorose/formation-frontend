// src/app/TestModule/page.tsx

import dynamic from 'next/dynamic';

const DynamicQuizComponentModule = dynamic(() => import('@/TestModule/Quiz'), {
  ssr: false, 
});

const TestModule = () => {
  return (
    <div>
      <h1>Test Module Page</h1>
      <DynamicQuizComponentModule />
    </div>
  );
};

export default TestModule;
