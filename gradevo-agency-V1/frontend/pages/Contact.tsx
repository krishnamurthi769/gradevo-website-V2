import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, ArrowRight, CheckCircle, Loader } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    services: [] as string[],
    message: ''
  });
  const [contactInfo, setContactInfo] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/content/site-content');
      const data = await res.json();
      const info: any = {};
      data.forEach((item: any) => {
        info[item.key] = item.value;
      });
      setContactInfo(info);
    } catch (err) {
      console.error('Failed to fetch contact info', err);
    }
  };

  const servicesList = [
    "Branding",
    "Social Media Management",
    "Content Creation & Marketing",
    "Ad Film/Video Production",
    "SEO",
    "Web Development",
    "UI/UX Design",
    "Other"
  ];

  const handleServiceChange = (service: string) => {
    setFormData(prev => {
      const services = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/content/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-32 bg-gradevo-navy min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
          <p className="text-gray-400 mb-8">Thank you for reaching out. We'll get back to you shortly.</p>
          <button
            onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', website: '', services: [], message: '' }); }}
            className="bg-gradevo-red text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 bg-gradevo-navy min-h-screen pb-20">
      <div className="container mx-auto px-6">
        <SectionHeader title="Let’s Build #Something Great" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
            <p className="text-gray-400 mb-12 text-lg leading-relaxed">
              Have a project in mind? We’d love to hear about it. Fill out the form and let’s start the conversation.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-white/5 p-3 rounded-lg">
                  <Mail className="text-gradevo-red" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email Us</h4>
                  <p className="text-gray-400">{contactInfo.email || 'hello@gradevo.com'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/5 p-3 rounded-lg">
                  <Phone className="text-gradevo-red" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Call Us</h4>
                  <p className="text-gray-400">{contactInfo.phone || '+91 80885 00769'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/5 p-3 rounded-lg">
                  <MapPin className="text-gradevo-red" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Visit Us</h4>
                  <p className="text-gray-400">{contactInfo.address || 'India'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-white/60 mb-2">Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-gradevo-red focus:outline-none transition-colors"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-gradevo-red focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-white/60 mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-gradevo-red focus:outline-none transition-colors"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Website / Social Link</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-gradevo-red focus:outline-none transition-colors"
                  placeholder="https://..."
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-4">I'm interested in...</label>
              <div className="flex flex-wrap gap-3">
                {servicesList.map(service => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => handleServiceChange(service)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${formData.services.includes(service)
                      ? 'bg-gradevo-red border-gradevo-red text-white'
                      : 'bg-transparent border-white/20 text-white/60 hover:border-white/40'
                      }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Message</label>
              <textarea
                required
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-gradevo-red focus:outline-none transition-colors"
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white text-gradevo-navy font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? <Loader className="animate-spin" /> : <>Send Message <ArrowRight size={20} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
