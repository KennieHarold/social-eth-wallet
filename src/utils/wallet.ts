import { Wallet } from 'ethers';

export const createEthWallet = () => {
  const wallet = Wallet.createRandom();
  return wallet;
};
