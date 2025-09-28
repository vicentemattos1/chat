import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useRegisterUserMutation } from '@/redux-store/api/authApi'

const signUpSchema = yup
  .object({
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email address')
      .max(255, 'Email must be less than 255 characters'),
    username: yup
      .string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be less than 30 characters')
      .matches(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ),
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  })
  .required()

type SignUpFormData = yup.InferType<typeof signUpSchema>

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const [registerUser] = useRegisterUserMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange',
  })

  const password = watch('password')

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await registerUser({
        email: data.email,
        username: data.username,
        password: data.password,
      }).unwrap()

      toast.success('Account created!')

      navigate('/login', { replace: true })
    } catch {
      toast('Failed to create your account')
    }
  }

  return (
    <div className="w-screen min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-xl space-y-10 animate-fade-in">
        {/* Back to Login */}
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground 
                     transition-colors duration-fast hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to sign in
          </Link>
        </div>

        {/* Sign Up Card */}
        <Card className="mx-auto max-w-md border-border bg-card shadow-lg animate-scale-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-card-foreground">
              Sign up
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Create your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className={`w-full bg-input border-border text-foreground placeholder:text-muted-foreground
                           focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-fast
                           hover:border-primary/50 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 animate-fade-in">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-foreground"
                >
                  Username *
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  {...register('username')}
                  className={`w-full bg-input border-border text-foreground placeholder:text-muted-foreground
                           focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-fast
                           hover:border-primary/50 ${errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
                {errors.username && (
                  <p className="text-sm text-red-500 animate-fade-in">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    {...register('password')}
                    className={`w-full pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground
                             focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-fast
                             hover:border-primary/50 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground 
                             hover:text-foreground transition-colors duration-fast p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 animate-fade-in">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-foreground"
                >
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                    className={`w-full pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground
                             focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-fast
                             hover:border-primary/50 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground 
                             hover:text-foreground transition-colors duration-fast p-1"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 animate-fade-in">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="p-3 bg-secondary/50 rounded-md space-y-2 animate-fade-in">
                  <p className="text-xs font-medium text-foreground">
                    Password requirements:
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li
                      className={`flex items-center space-x-2 ${password.length >= 8 ? 'text-green-500' : ''}`}
                    >
                      <span>{password.length >= 8 ? '✓' : '○'}</span>
                      <span>At least 8 characters</span>
                    </li>
                    <li
                      className={`flex items-center space-x-2 ${/[A-Z]/.test(password) ? 'text-green-500' : ''}`}
                    >
                      <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span>
                      <span>One uppercase letter</span>
                    </li>
                    <li
                      className={`flex items-center space-x-2 ${/[a-z]/.test(password) ? 'text-green-500' : ''}`}
                    >
                      <span>{/[a-z]/.test(password) ? '✓' : '○'}</span>
                      <span>One lowercase letter</span>
                    </li>
                    <li
                      className={`flex items-center space-x-2 ${/\d/.test(password) ? 'text-green-500' : ''}`}
                    >
                      <span>{/\d/.test(password) ? '✓' : '○'}</span>
                      <span>One number</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-0.5 text-primary bg-input border-border rounded 
                           focus:ring-ring focus:ring-2 transition-colors duration-fast"
                  required
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-5"
                >
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-primary hover:text-primary-hover hover:underline transition-colors duration-fast"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    className="text-primary hover:text-primary-hover hover:underline transition-colors duration-fast"
                  >
                    Privacy Policy
                  </button>
                </Label>
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground
                         transition-all duration-smooth transform hover:scale-[1.02] active:scale-[0.98]
                         shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Sign in link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/"
                  className="text-primary hover:text-primary-hover transition-colors duration-fast
                           hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SignUp
