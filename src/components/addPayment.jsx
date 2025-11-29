import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/ui.jsx";
import { Input } from "./ui/ui.jsx";
import { Button } from "./ui/ui.jsx";
import { useAuth } from '../Authcontext.jsx'
import supabase from '../config/supabaseClient.js'

const AddPaymentForm = ({ darkMode }) => {
  const [paymentName, setPaymentName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState('One-time');
  const [dueDate, setDueDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [autoPay, setAutoPay] = useState(false);

  const { session } = useAuth();

  const handleAddPayment = async (event) => {
    event.preventDefault();

    if (!session || !session.user) {
      alert("You must be logged in to add a payment.");
      return;
    }

    try {
      const paymentData = {
        payment_name: paymentName,
        category: category,
        amount: parseFloat(amount),
        frequency: frequency,
        payment_method: paymentMethod,
        due_date: dueDate,
        autopay: autoPay,
        auth_id: session.user.id,
        status: 'active',
        auto_payment_enabled: autoPay
      };

      // Save directly to payments table
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData]);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to add payment');
      }

      console.log('Payment added successfully:', data);
      alert('Payment/Bill added successfully!');

      // Reset form
      setPaymentName("");
      setCategory("");
      setAmount("");
      setFrequency("One-time");
      setPaymentMethod("");
      setDueDate("");
      setAutoPay(false);
    } catch (error) {
      console.error('Error adding payment:', error);
      alert(`Error adding payment: ${error.message}`);
    }
  };

  return (
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
              <SelectItem value="one-time">One-time</SelectItem>
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
