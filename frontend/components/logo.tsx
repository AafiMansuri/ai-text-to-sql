import React from 'react'
import Image from "next/image"

interface LogoProps {
    className?: string
    size?: "sm" | "md" | "lg"
  }

const Logo = ({ className = "", size = "sm" }: LogoProps) => {
    const dimensions = {
        sm: 40,
        md: 60,
        lg: 80,
      }

    const logoSize = dimensions[size]

    return (
        <div className={`flex items-center ${className}`}>
          <Image
            src={`/placeholder.svg?height=${logoSize}&width=${logoSize}`}
            alt="Velora Logo"
            width={logoSize}
            height={logoSize}
          />
          <span
            className={`ml-2 font-bold text-gray-800 ${size === "lg" ? "text-4xl" : size === "md" ? "text-2xl" : "text-xl"}`}
          >
          </span>
        </div>
      )
}

export default Logo