"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface formData {
    name: string
    email: string
    password: string
}

export default function AuthForm() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: ""
    })

    return (
        <div className="min-h-screen bg-gray-50 flex items-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-2xl font-bold text-center">
                    <CardHeader className="text-2xl font-bold text-center">
                        {/* isLogin */}
                    </CardHeader>

                    <CardDescription>
                        {/* isLogin */}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="space-y-4">
                        {/* {isLogin &&} */
                            (
                                <div className="space-y-2">
                                    {/* <Label html="name"></Label> */}
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        // required={!isLogin}
                                        value={formData.name}
                                        // onChange={handleInputChange}
                                        placeholder="Enter your email"
                                    />
                                </div>
                            )}
                        <div className="space-y-2">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                // onChange={handleInputChange}
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="space-y-2">
                            {/* {<Label htmlFor="password">Password</Label>} */}
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                // onChange={handleInputChange}
                                placeholder="Enter your password"
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}