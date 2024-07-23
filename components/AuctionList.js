import React, { useState, useEffect } from "react";
import PlaceBid from "./PlaceBid";

const AuctionList = ({ nftContract, shortAddress, account }) => {
  const [formattedAuctions, setFormattedAuctions] = useState([]);
  const [selectedAuctionItem, setSelectedAuctionItem] = useState(null); // State to store selected auction item

  useEffect(() => {
    const fetchData = async () => {
      if (!nftContract) return;

      try {
        const allAuctions = await nftContract.methods.getAllAuctions().call();
        const activeAuctions = allAuctions.filter(
          (auction) =>
            auction.seller !== "0x0000000000000000000000000000000000000000"
        );

        const formattedData = activeAuctions.map((auction) => ({
          tokenId: auction.tokenId,
          startingPrice: auction.startingPrice.toString(),
          currentPrice: auction.currentPrice.toString(),
          seller: auction.seller,
          startedTime: auction.startedTime,
        }));

        setFormattedAuctions(formattedData);
      } catch (error) {
        console.error("Error fetching auction list:", error);
      }
    };

    fetchData();
  }, [nftContract]);

  const handleClick = (auctionItem) => {
    setSelectedAuctionItem(auctionItem);
  };

  return (
    <div className="auction-items">
      <h2>Auction Items</h2>
      {formattedAuctions && formattedAuctions.length > 0 ? (
        formattedAuctions.map((item) => (
          <div
            key={item.tokenId}
            className="auction-item"
            onClick={() => handleClick(item)}
          >
            {/* Display asset details (image, name, etc.) based on your implementation */}
            <img src="..." alt="Image" />
            <p>Starting Price: {item.startingPrice} WEI</p>
            <p>
              Highest Bid:{" "}
              {item.currentPrice === item.startingPrice
                ? "No Bids Yet"
                : `${item.currentPrice} WEI`}
            </p>
            <p>Seller: {shortAddress(item.seller)}</p>
            {/* Add button to place a bid (call placeBid function) */}
            <button
              type="submit"
              className="bid-submit"
              onClick={() => handleClick(item)}
            >
              Place Bid
            </button>
            <br />
            <br />
            <br />
            {selectedAuctionItem &&
              selectedAuctionItem.tokenId === item.tokenId && (
                <PlaceBid
                  contract={nftContract}
                  auctionItem={selectedAuctionItem}
                  account={account} // Assuming 'account' is available in your component
                />
              )}
          </div>
        ))
      ) : (
        <p>No auction items found.</p>
      )}
    </div>
  );
};

export default AuctionList;
