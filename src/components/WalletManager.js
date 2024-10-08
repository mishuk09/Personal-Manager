import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WalletManager = () => {
  const [wallet, setWallet] = useState({
    totalAmount: 0,
    totalCost: 0,
    costs: [],
  });
  const [costName, setCostName] = useState('');
  const [costAmount, setCostAmount] = useState('');
  const [newTotalAmount, setNewTotalAmount] = useState('');

  // Fetch wallet data from the backend
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/costs');
        setWallet(response.data);
      } catch (error) {
        console.error('Error fetching wallet data', error);
      }
    };
    fetchWalletData();
  }, []);

  // Handle form submission to add a new cost
  const handleAddCost = async (e) => {
    e.preventDefault();

    if (costName === '' || costAmount === '') {
      alert('Please fill in both fields');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/add-cost', {
        costName,
        costAmount: parseFloat(costAmount), // Convert to a number
      });

      // Fetch updated wallet data
      const response = await axios.get('http://localhost:5000/api/costs');
      setWallet(response.data);

      // Clear input fields after submission
      setCostName('');
      setCostAmount('');
    } catch (error) {
      console.error('Error adding cost', error);
    }
  };

  // Handle updating total amount
  const handleUpdateTotalAmount = async (e) => {
    e.preventDefault();

    if (newTotalAmount === '') {
      alert('Please enter a total amount');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/update-total', {
        newAmount: parseFloat(newTotalAmount), // Convert to a number
      });

      // Fetch updated wallet data
      const response = await axios.get('http://localhost:5000/api/costs');
      setWallet(response.data);

      // Clear the input field
      setNewTotalAmount('');
    } catch (error) {
      console.error('Error updating total amount', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg w-full max-w-lg p-6">
        {/* Display Total Amount and Total Cost */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center mb-4">Personal Wallet Manager</h1>
          <div className="flex justify-between text-lg font-semibold">
            <div>Total Amount: <span className="text-green-500">${wallet.totalAmount}</span></div>
            <div>Total Cost: <span className="text-red-500">${wallet.totalCost}</span></div>
          </div>
        </div>

        {/* Form to Add a New Cost */}
        <form onSubmit={handleAddCost} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Name</label>
            <input
              type="text"
              value={costName}
              onChange={(e) => setCostName(e.target.value)}
              className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter cost name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Amount</label>
            <input
              type="number"
              value={costAmount}
              onChange={(e) => setCostAmount(e.target.value)}
              className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter cost amount"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Cost
          </button>
        </form>

        {/* Form to Update Total Amount */}
        <form onSubmit={handleUpdateTotalAmount} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Total Amount</label>
            <input
              type="number"
              value={newTotalAmount}
              onChange={(e) => setNewTotalAmount(e.target.value)}
              className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new total amount"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Update Total Amount
          </button>
        </form>

        {/* List of All Costs */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Cost Details:</h2>
          {wallet.costs.length === 0 ? (
            <p>No costs added yet.</p>
          ) : (
            <ul className="space-y-2">
              {wallet.costs.map((cost, index) => (
                <li key={index} className="flex justify-between bg-gray-100 p-2 rounded-md">
                  <span>{cost.costName}</span>
                  <span className="text-red-500">${cost.costAmount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletManager;
