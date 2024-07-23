import React, { useState } from "react";

const PlaceBid = ({ contract, auctionItem, account }) => {
  const [bidAmount, setBidAmount] = useState(0);

  const placeBid = async (event) => {
    event.preventDefault();

    try {
      const tx = await contract.methods.placeBid(auctionItem.tokenId).send({
        from: account,
        value: bidAmount,
      });
      console.log("Bid placed successfully:", tx);
      // Update UI after successful bid placement (e.g., clear bid amount, fetch updated auction data)
    } catch (error) {
      console.error("Error placing bid:", error);
      // Handle errors (e.g., insufficient funds, invalid bid amount)
    }
  };

  return (
    <div className="place-bid-form">
      <h3>Place a Bid</h3>
      <form onSubmit={placeBid}>
        <label>
          Bid Amount (WEI):
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
            className="bid-input"
          />
        </label>
        <button type="submit" className="bid-submit">
          Place Bid
        </button>
      </form>
    </div>
  );
};

export default PlaceBid;
