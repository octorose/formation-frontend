// src/app/TestLogic/page.tsx

import dynamic from 'next/dynamic';

const DynamicQuizComponent = dynamic(() => import('@/TestLogic/Quiz'), {
  ssr: false, // Désactiver le rendu côté serveur
});

const TestLogicPage = () => {
  return (
    <div>
      <h1>Test Logic Page</h1>
      <DynamicQuizComponent />
    </div>
  );
};

export default TestLogicPage;
