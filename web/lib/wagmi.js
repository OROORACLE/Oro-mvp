import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/0c92cb9be774484c9ee8ca5ecb753b46'),
  },
})

export const ORO_BADGE_CONTRACT = '0x7fd112d62e3D32bD3667c878dfAf582B18d4266b'
