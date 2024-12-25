import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { handleError, sendEmailOTP, verifyOTP } from '@/lib/actions/user.action';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const OTPModel = ({ email, accountId }: { email: string; accountId: string }) => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleVerifyOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      setOpen(true);

      const sessionId = await verifyOTP({ accountId, password });

      if (sessionId) router.push("/");
    } catch (error) {
      handleError(error, "Failded to send OTP")
      console.log("Failed to verify OTP", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    await sendEmailOTP({email});
    setLoading(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="flex flex-col flex-center">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[3vw]">Enter the OTP</AlertDialogTitle>
          <AlertDialogDescription>
            We&apos;ve sent a code to <span className="font-semibold text-center">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="bordered" aria-required />
            <InputOTPSlot index={1} className="bordered" aria-required />
            <InputOTPSlot index={2} className="bordered" aria-required />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="bordered" aria-required />
            <InputOTPSlot index={4} className="bordered" aria-required />
            <InputOTPSlot index={5} className="bordered" aria-required />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full gap-4 flex-col">
            <AlertDialogAction className="w-[25vw]" disabled={loading} onClick={handleVerifyOtp}>
              {loading ? "Verifying..." : "Verify OTP"}
            </AlertDialogAction>

            <Button type="button" onClick={handleResendOtp} variant="link" className={`${loading && "cursor-not-allowed"}`} disabled={loading}>
              Resend OTP
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPModel;
