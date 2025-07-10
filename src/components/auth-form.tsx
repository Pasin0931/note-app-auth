"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface AuthFormProps {
    onAuthSuccess: (token: string, user: any) => void
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {

    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const endPoint = isLogin ? "/api/auth/login" : "api/auth/register"
            const body = isLogin ? { email: formData.email, password: formData.password } : formData

            const res = await fetch(endPoint, {method: "POST", headers: {"Content-Type" : "application.json"}, body: JSON.stringify(body)})

            const data = await res.json()

            if (res.ok) {
                onAuthSuccess(data.token, data.user)
            } else {
                setError(data.error || "Authentication failed")
            }
        } catch (error) {
            setError("Network error. Please try again")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-2xl font-bold text-center">
                    <CardHeader className="text-2xl font-bold text-center">
                        {isLogin ? "Sign into your account" : "Create your account"}
                    </CardHeader>

                    <CardDescription>
                        {isLogin ? "Enter your email and password to sign in." : "Enter your information to create a new account."}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin &&
                            (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required={!isLogin}
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                            />
                        </div>

                        {error && (
                            <Alert variant='destructive'>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full">
                            {isLogin ? "Sign In" : "Sign Up"}
                        </Button>

                    </form>

                    <div className="text-center mt-4">
                        <Button variant="link"
                            onClick={() => {
                                setIsLogin(!isLogin)
                                // setError("")
                                // setFormData({})
                            }}
                        >{isLogin ? "Don't have an account ? Sign Up" : "Already have an account ? Sign In"}</Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}