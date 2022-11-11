import React from 'react'

type Props = {}

const HeaderWalletPage = (props: Props) => {
  return (
    <div className="w-full justify-end flex">
    <div className="w-4/6  justify-end p-4 flex">
      <button className="btn-blue-1 rounded">Add a Wallet</button>
    </div>
    </div>
  );
}

export default HeaderWalletPage