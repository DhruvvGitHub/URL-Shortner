import React, { useEffect, useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from '../ui/input'
import {ClipLoader} from "react-spinners"
import { Button } from '../ui/button'
import Error from '../error/Error'
import * as Yup from "yup"
import useFetch from '@/hooks/useFetch'
import login from '@/db/apiAuth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UrlState } from '@/Context'

const Login = () => {
    const [errors, setErrors] = useState({})
    const [apiError, setApiError] = useState("")

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const longLink = searchParams.get("createNew")

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const {data, error, loading, fn:fnLogin} = useFetch(login, formData)
    const {fetchUser} = UrlState()

    useEffect(() => {
        if (error === null && data) {
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`)
            fetchUser()
        }
    },[data, error])

    const handleLogin = async () => {
        try {
            setApiError("") // Clear previous API errors
            const schema = Yup.object().shape({
                email: Yup.string().email("Invalid email").required("Email is required"),
                password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
            })

            await schema.validate(formData, {abortEarly: false}) 
            await fnLogin()
            setErrors({}); // clear validation errors
        } catch (error) {
            if (error?.inner) {
                // Yup validation error
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            } else {
                // Other errors
                setApiError(error.message || "An error occurred during login")
            }
        }
    }

  return (
    <div>
      <Card>
  <CardHeader>
    <CardTitle>Login</CardTitle>
    <CardDescription>to your account if you have one</CardDescription>
    {apiError && <Error message={apiError} />}
  </CardHeader>

  <CardContent>
    <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        {error && <Error message={error.message}/>}
      <div className="flex flex-col gap-4">
        <div>
          <Input
            onChange={handleInputChange}
            type="email"
            name="email"
            placeholder="Enter your registered email"
            autoComplete="off"
          />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div>
          <Input
            onChange={handleInputChange}
            type="password"
            name="password"
            placeholder="Please enter password"
            autoComplete="off"
          />
          {errors.password && <Error message={errors.password} />}
        </div>
      </div>

      <CardFooter className="p-0 pt-4">
        <Button type="submit">
          {loading ? <ClipLoader size={22} /> : "Login"}
        </Button>
      </CardFooter>
    </form>
  </CardContent>
</Card>

    </div>
  )
}

export default Login