"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datepicker";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createTransfer } from "../actions";
import SelectCustom, { SelectOption } from "@/components/ui/select-custom";
import { CurrencyInputCustom } from "@/components/ui/currency-input";

interface TransferFormProps {
    walletOptions: SelectOption[];
}

export function TransferForm({ walletOptions }: TransferFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [fromWallet, setFromWallet] = useState<string>("");
    const [toWallet, setToWallet] = useState<string>("");
    const [amount, setAmount] = useState<string>("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!fromWallet) {
            toast.error("Source wallet is required");
            return;
        }

        if (!toWallet) {
            toast.error("Destination wallet is required");
            return;
        }

        if (fromWallet === toWallet) {
            toast.error("Source and destination wallet cannot be the same");
            return;
        }

        if (!amount || amount === "0") {
            toast.error("Amount must be greater than 0");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            
            if (!formData.get("transaction_date")) {
                toast.error("Transaction date is required");
                setIsLoading(false);
                return;
            }
            formData.set("from_wallet_id", fromWallet);
            formData.set("to_wallet_id", toWallet);
            formData.set("amount", amount);
            
            const result = await createTransfer(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Transfer created successfully!");
                router.push("/transfer-balance");
            }
        } catch (error) {
            toast.error("Failed to create transfer");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full shadow-sm">
            <CardHeader>
                <CardTitle>Create Transfer</CardTitle>
                <CardDescription>Move balance from one wallet to another.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>From Wallet</Label>
                            <SelectCustom
                                options={walletOptions}
                                value={fromWallet}
                                onValueChange={setFromWallet}
                                placeholder="Select source wallet"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>To Wallet</Label>
                            <SelectCustom
                                options={walletOptions}
                                value={toWallet}
                                onValueChange={setToWallet}
                                placeholder="Select destination wallet"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Amount</Label>
                            <CurrencyInputCustom
                                id="amount"
                                name="amount"
                                value={amount}
                                onValueChange={(val) => setAmount(val || "")}
                                placeholder="Rp. 0"
                                prefix="Rp "
                                decimalsLimit={0}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Transaction Date</Label>
                            <DatePicker name="transaction_date" className="w-full" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                            name="description" 
                            placeholder="Enter notes or description (optional)" 
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => router.push("/transfer-balance")}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Transfer"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
