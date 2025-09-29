import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/ui.jsx"; // Adjusted path for ui components
import { Input } from "./ui/ui.jsx"; // Adjusted path for ui components
import { Button } from "./ui/ui.jsx"; // Adjusted path for ui components
import { useAuth } from '../Authcontext.jsx'
import supabase from '../config/supabaseClient.js'

// This is the component you created, now in its own file.
const AddPaymentForm = ({ darkMode }) => {
  // 1. State variables to store form input values
  const [paymentName, setPaymentName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [autoPay, setAutoPay] = useState(false);

  // Get the current session from the AuthContext
  const { session } = useAuth(); 

  // 2. Function to handle form submission
  const handleAddPayment = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior (page reload)

    // Check if the user is logged in by looking at the session object
    if (!session || !session.user) {
      alert("You must be logged in to add a payment.");
      return;
    }
    console.log(session.user.id);

    // 3. Insert the data into the 'payments' table
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          payment_name: paymentName,
          category: category,
          amount: parseFloat(amount), // Ensure amount is a number
          frequency: frequency,
          payment_method: paymentMethod,
          due_date: dueDate,
          auth_id: session.user.id, // Get the user's ID from the session
          autopay: autoPay,
        },
      ])
      .select(); // Use .select() to get the inserted data back

    if (error) {
      console.error('Error adding payment:', error);
      alert(`Failed to add payment: ${error.message}`);
    } else {
      console.log('Payment added successfully:', data);
      alert('Payment added successfully!');
      // Optional: Clear form fields after successful submission
      setPaymentName('');
      setAmount('');
      setCategory('');
      setFrequency('');
      setDueDate('');
      setPaymentMethod('');
    }
  };

  return (
    // Corrected the className syntax with a template literal
    <div className={`border-8 border-black p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
      <h3 className="font-black text-xl mb-6">ADD NEW PAYMENT</h3>
      <form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-black text-sm mb-2">PAYMENT NAME</label>
          <Input
            placeholder="e.g., Monthly Rent"
            className="border-4 border-black font-bold"
            value={paymentName}
            onChange={(e) => setPaymentName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-black text-sm mb-2">AMOUNT (₹)</label>
          <Input
            type="number"
            placeholder="15000"
            className="border-4 border-black font-bold"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-black text-sm mb-2">CATEGORY</label>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger className="border-4 border-black font-bold">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="housing">Housing</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block font-black text-sm mb-2">FREQUENCY</label>
          <Select onValueChange={setFrequency} value={frequency}>
            <SelectTrigger className="border-4 border-black font-bold">
              <SelectValue placeholder="Select a frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block font-black text-sm mb-2">DUE DATE</label>
          <Input
            type="date"
            className="border-4 border-black font-bold"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-black text-sm mb-2">PAYMENT METHOD</label>
          <Select onValueChange={setPaymentMethod} value={paymentMethod}>
            <SelectTrigger className="border-4 border-black font-bold">
              <SelectValue placeholder="Select a payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hdfc1234">HDFC Bank ****1234</SelectItem>
              <SelectItem value="sbi5678">SBI Bank ****5678</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
            <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" checked={autoPay} onChange={(e) => setAutoPay(e.target.checked)} id="autopay" className="w-4 h-4" />
                <label htmlFor="autopay" className="font-black text-sm">
                ENABLE AUTO-PAY
                </label>
            </div>
            <div className="flex gap-4 mt-6">
                <Button type="submit" className="bg-blue-600 border-4 border-black font-black hover:bg-blue-700">
                ADD PAYMENT
                </Button>
                <Button type="button" variant="outline" className="border-4 border-black font-black bg-transparent">
                CANCEL
                </Button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default AddPaymentForm;
