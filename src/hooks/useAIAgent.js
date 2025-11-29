// import { useState, useEffect } from 'react';
// import { supabase } from '../supabaseClient';

// export const useAIAgent = (userId) => {
//   const [aiStatus, setAIStatus] = useState({});
//   const [insights, setInsights] = useState([]);
//   const [alerts, setAlerts] = useState([]);

//   const fetchAIStatus = async () => {
//     try {
//       const response = await fetch(/api/user/${userId}/ai-status);
//       const data = await response.json();
//       setAIStatus(data || {});
//     } catch (error) {
//       console.error('Error fetching AI status:', error);
//     }
//   };

//   const fetchInsights = async () => {
//     try {
//       const response = await fetch(/api/user/${userId}/dashboard);
//       const data = await response.json();
//       setInsights(data?.ai_insights || []);
//       setAlerts(data?.alerts || []);
//     } catch (error) {
//       console.error('Error fetching insights:', error);
//     }
//   };

//   const subscribeToAlerts = () => {
//     const subscription = supabase
//       .channel('budget_alerts')
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'budget_alerts',
//           filter: auth_id=eq.${userId},
//         },
//         (payload) => {
//           setAlerts((prev) => [payload.new, ...prev]);
//         }
//       )
//       .subscribe();

//     // Proper cleanup
//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   };

//   useEffect(() => {
//     if (!userId) return;

//     fetchAIStatus();
//     fetchInsights();
//     const cleanup = subscribeToAlerts();

//     return () => {
//       cleanup(); // unsubscribe properly
//     };
//   }, [userId]);

//   const submitExpenseForAI = async (expenseData) => {
//     try {
//       const response = await fetch(/api/user/${userId}/expense, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(expenseData),
//       });

//       const result = await response.json();

//       if (result.alerts?.length > 0) {
//         setAlerts((prev) => [...result.alerts, ...prev]);
//       }

//       return result.expense;
//     } catch (error) {
//       console.error('Error submitting expense:', error);
//       throw error;
//     }
//   };

//   return {
//     aiStatus,
//     insights,
//     alerts,
//     submitExpenseForAI,
//     refreshInsights: fetchInsights,
//   };
// };