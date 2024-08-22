// src/app/TestSecurite/page.tsx

import dynamic from 'next/dynamic';

const DynamicQuizComponentModule = dynamic(() => import('@/TestSecurite/Quiz'), {
  ssr: false, 
});

const TestSecurite = () => {
  return (
    <div>
      <h1>Test Securite Page</h1>
      <DynamicQuizComponentModule />
    </div>
  );
};

export default TestSecurite;
