import PosteForm from '@/Components/Forms/PosteForm'
import React from 'react'
import withAuth from '@/utils/HOC/withAuth';

function AddPoste() {
    return (
      <>  
    
          <PosteForm />
      </>
    )
  }
  
  export default withAuth(AddPoste);