import React from 'react'
import "@/app/globals.css";

const Layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <html>
        <body>
            {children}
        </body>
    </html>
  )
}

export default Layout