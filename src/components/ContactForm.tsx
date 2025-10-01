import React, { useState } from 'react';
import { contactApi } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ContactForm: React.FC = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactApi.sendMessage(form);
      toast({ title: 'Sent', description: 'Your message has been sent successfully.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      const apiMessage = err?.response?.data?.error || err?.message || 'Failed to send message. Try again later.';
      toast({ title: 'Error', description: String(apiMessage), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">Subject *</Label>
        <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send Message'}</Button>
      </div>
    </form>
  );
};

export default ContactForm;


