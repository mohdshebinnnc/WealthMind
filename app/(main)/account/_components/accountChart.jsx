"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { endOfDay, format, startOfDay, subDays } from 'date-fns'
import { defaultCategories } from '@/data/categories'
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useMemo, useState } from 'react'

const DATE_RANGES={
    "7D":{label:"Last 7 Days", days:7},
    "1M":{label:"Last 1 Month", days:30},
    "3M":{label:"Last 3 Months", days:90},
    "6M":{label:"Last 6 Months", days:180},
    "ALL":{label:"All Time", days:null},
}

const AccountChart = ({transactions }) => {
    const [dataRange, setDataRange]=useState("1M");

    const filteredData=useMemo(()=>{
        // Guard against undefined transactions
        if (!transactions || !Array.isArray(transactions)) {
            return [];
        }

        const range=DATE_RANGES[dataRange];
        const now=new Date();
        const startDate=range.days ? startOfDay(subDays(now, range.days)) : startOfDay(new Date(0));

        const filtered = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            const isInRange = transactionDate >= startDate && transactionDate <= endOfDay(now);
            return isInRange;
        });


        if (filtered.length === 0) {
            const allFiltered = transactions.filter(t => new Date(t.date));
            return [];
        }

        const grouped=filtered.reduce((acc, transaction)=>{
            const date=format(new Date(transaction.date), "MMM dd");

            if(!acc[date]){
                acc[date]={date, income:0, expense:0};
            }
            
            const amount = Math.abs(Number(transaction.amount)) || 0;

            const categoryData = defaultCategories.find(cat => cat.id === transaction.category || cat.name.toLowerCase() === transaction.category?.toLowerCase());
            const categoryType = categoryData?.type;
            
            if (categoryType === "INCOME") {
                acc[date].income += amount;
            } else {
                acc[date].expense += amount;
            }
            
            return acc;
        },{});

        return Object.values(grouped).sort((a,b)=> new Date(a.date) - new Date(b.date));

    },[transactions, dataRange])

    const totals=useMemo(()=>{
        const result = filteredData.reduce((acc, item)=>({
            income: acc.income + item.income,
            expense: acc.expense + item.expense,
        }),{income:0, expense:0});
        

        
        return result;
    },[filteredData])

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <CardTitle className="text-base font-normal" >Transaction Overview</CardTitle>
                <Select value={dataRange} onValueChange={setDataRange}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(DATE_RANGES).map(([key, {label}])=>(
                            <SelectItem key={key} value={key} >
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className='flex justify-around mb-6 text-sm'>
                    <div className='text-center'>
                        <p className='text-muted-foreground'>Total Income</p>
                        <p className='text-lg font-bold text-green-500'>${totals.income.toFixed(2)}</p>
                    </div>

                    <div className='text-center'>
                        <p className='text-muted-foreground'>Total Expenses</p>
                        <p className='text-lg font-bold text-red-500'>${totals.expense.toFixed(2)}</p>
                    </div>

                    <div className='text-center'>
                        <p className='text-muted-foreground'>Net</p>
                        <p className={`text-lg font-bold ${totals.income -totals.expense>=0 ? "text-green-500":"text-red-500"}`}>${(totals.income - totals.expense).toFixed(2)}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={filteredData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 10,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                tickFormatter={(value) => `$${value.toFixed(0)}`} 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <Tooltip 
                                formatter={(value, name) => [`$${value.toFixed(2)}`, name === 'income' ? 'Income' : 'Expense']}
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Legend />
                            <Bar 
                                dataKey="income" 
                                name="Income"
                                fill="#22c55e" 
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar 
                                dataKey="expense" 
                                name="Expense"
                                fill="#ef4444" 
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        
    )
}

export default AccountChart
