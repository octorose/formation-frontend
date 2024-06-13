import  LoginForm  from '@/Components/LoginForm/LoginForm'
import Image from 'next/image'
import logo from '@/images/blacklogo.png'
import React from 'react'
import { AuroraBackground } from '@/Components/Aurora/aurora'
import { classNames } from '../utils/cn';

function Login() {
  return (
        <AuroraBackground className='h-screen'>

            <nav className='flex justify-between m-10'>
                <Image src={logo} alt='logo' width={300}  />
            </nav>
            <LoginForm />
        </AuroraBackground>

  )
}

export default Login