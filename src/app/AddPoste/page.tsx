
"use client";
import PosteForm from '@/Components/Forms/PosteForm'
import React from 'react'
import withAuth from '@/utils/HOC/withAuth';

function page() {
    return (
      <>  
          <PosteForm />
      </>
    )
  }
  
  export default withAuth(page,['Method']);