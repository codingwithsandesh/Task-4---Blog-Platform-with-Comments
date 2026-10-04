import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Mail, User, Send, CheckCircle2, MessageSquareText } from 'lucide-react';

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (name.trim().length < 2) {
      setErrorMessage('Name is required.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (subject.trim().length < 3) {
      setErrorMessage('Subject must be at least 3 characters.');
      return;
    }
    if (message.trim().length < 10) {
      setErrorMessage('Message must be at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitContact({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
      showToast('Inquiry sent successfully! Our board will review it.', 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry.');
      showToast('Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
          Editorial Inquiries · Bharat Desk
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          Get in Touch with BlogSphere
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
          Editorial offices in Bengaluru (Koramangala) and New Delhi (Vasant Kunj). Send a direct note to our board.
        </p>
      </div>

      <div className="bg-white border border-[#E7E3DC] rounded-2xl p-6 sm:p-8 shadow-xs">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="font-serif text-2xl font-semibold text-stone-900">
              Message Received
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto">
              Thank you for reaching out, <strong>{name}</strong>. Your correspondence has been routed to our editorial desk and we will reply via <strong>{email}</strong> shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
              }}
              className="px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Your Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Aurelius"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcus@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Subject</label>
              <div className="relative">
                <MessageSquareText className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Editorial Contribution / Feature Request"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts or proposal..."
                rows={5}
                className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Transmitting Note...' : 'Send Message'}</span>
            </button>
          </form>
        )}
      </div>

      <div className="p-4 bg-stone-100/70 border border-stone-200/80 rounded-xl text-xs text-stone-600 space-y-1">
        <p className="font-semibold text-stone-800">Operational Notice & SMTP Integrations:</p>
        <p className="text-[11px] text-stone-500">
          In production environments, outgoing emails can be seamlessly configured with transactional email providers like Resend, Amazon SES, or SendGrid by setting <code>SMTP_HOST</code> or <code>RESEND_API_KEY</code> in <code>.env</code>.
        </p>
      </div>

    </div>
  );
};
