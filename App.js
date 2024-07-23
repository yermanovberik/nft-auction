import "./styles.css";
import { useEffect, useState } from "react";

import Connect from "./components/Connect";
import AuctionList from "./components/AuctionList";
import PlaceBid from "./components/PlaceBid";
import ProfileCreation from "./components/ProfileCreation";

export default function App() {
  const [account, setAccount] = useState(null);
  const [profileExists, setProfileExists] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [nftContract, setNFTContract] = useState(null);
  const [profileContract, setProfileContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auctionItems, setAuctionItems] = useState([]);
  const [selectedAuctionItem, setSelectedAuctionItem] = useState(null);

  async function checkProfile() {
    const userProfile = await getProfile(account);

    setProfileExists(userProfile);
  }

  async function getProfile() {
    if (!web3 || !profileContract || !account) {
      console.error(
        "Web3 or profileContract not initialized or account not connected."
      );
      return;
    }

    const profile = await profileContract.methods.getProfile(account).call();
    setLoading(false);
    return profile.displayName;
  }

  async function handleLogout() {
    setAccount(null);
    setProfileExists(null);
  }

  useEffect(() => {
    if (contract && account) {
      if (profileExists) {
      } else {
        checkProfile();
      }
    }
  }, [contract, account, profileExists]);

  function shortAddress(address, startLength = 6, endLength = 4) {
    if (address === account && profileExists) {
      return profileExists;
    } else if (address) {
      return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
    }
  }

  return (
    <div className="container">
      <h1>NFT Auction DAPP</h1>
      <Connect
        web3={web3}
        setWeb3={setWeb3}
        account={account}
        setAccount={setAccount}
        setNFTContract={setNFTContract}
        setContract={setContract}
        shortAddress={shortAddress}
        setProfileContract={setProfileContract}
      />
      {!loading && profileExists ? (
        <>
          <AuctionList
            nftContract={nftContract}
            shortAddress={shortAddress}
            account={account}
          />
          <br />
          <br />
          <button type="submit" className="bid-submit" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        account &&
        !loading && (
          <>
            <ProfileCreation
              account={account}
              profileContract={profileContract}
              checkProfile={checkProfile}
            />
          </>
        )
      )}
    </div>
  );
}
