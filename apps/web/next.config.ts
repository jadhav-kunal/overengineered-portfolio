import type { NextConfig } from 'next'

const config: NextConfig = {
  devIndicators: false,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
}

export default config
