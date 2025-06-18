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
import { signUp } from '@/db/apiAuth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UrlState } from '@/Context'
import { Label } from '../ui/label'

const SignUp = () => {
    const [errors, setErrors] = useState({})
    const [apiError, setApiError] = useState("")

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const longLink = searchParams.get("createNew")

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profile_pic: null
    })

    const handleInputChange = (e) => {
        const {name, value, files} = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: files ? files[0] : value
        }))
    }

    const {data, error, loading, fn:fnSignUp} = useFetch(signUp, formData)
    const {fetchUser} = UrlState()

    useEffect(() => {
        if (error === null && data) {
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`)
            fetchUser()
        }
    },[data, error])

    const hanldeSignUp = async () => {
        try {
            setApiError("") // Clear previous API errors
            const schema = Yup.object().shape({
                name: Yup.string().required("Name is required"),
                email: Yup.string().email("Invalid email").required("Email is required"),
                password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
                profile_pic: Yup.mixed().required("Profile pic is required")
            })

            await schema.validate(formData, {abortEarly: false}) 
            await fnSignUp()
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
    <CardTitle>SignUp</CardTitle>
    <CardDescription>create a new account if you haven't yet</CardDescription>
            {apiError && <Error message={apiError} /> }
  </CardHeader>
  <CardContent>
    <form action="" autoComplete='off' onSubmit={(e) => {e.preventDefault(); hanldeSignUp()}}>
        {error && <Error message={error.message}/>}
            <div className='flex flex-col gap-4'>
        <div>
            <Input onChange={handleInputChange} type="text" name="name" placeholder="Full Name" />
            {errors.name && <Error message={errors.name} /> }
        </div>
        <div>
            <Input onChange={handleInputChange} type="email" name="email" placeholder="Email" />
            {errors.email && <Error message={errors.email} /> }
        </div>
        <div>
            <Input onChange={handleInputChange} type="password" name="password" placeholder="Password" />
            {errors.password && <Error message={errors.password} /> }
        </div>
        <div>
            <Label className="my-2">Choose a profile pic</Label>
            <Input onChange={handleInputChange} type="file" name="profile_pic" accept="image/*" placeholder="Please enter password" />
        </div>
    </div>
    </form>
  </CardContent>
  <CardFooter>
    <Button onClick={hanldeSignUp}>
        {loading ? <ClipLoader size={22} />: "Create Account"}
    </Button>
  </CardFooter>
</Card>
    </div>
  )
}

export default SignUp