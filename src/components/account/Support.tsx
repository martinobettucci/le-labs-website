import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle, Send } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 'credits-work',
    question: 'How do credits work?',
    answer: 'Credits are consumed when you use our AI tools. Different operations consume different amounts of credits based on their complexity and computational requirements. Simple operations might use 1-5 credits, while complex processing could use 10-50 credits.',
  },
  {
    id: 'credits-expire',
    question: 'Do credits expire?',
    answer: 'Purchased credits never expire! However, subscription credits have rollover limits. Check your subscription plan for specific rollover details.',
  },
  {
    id: 'refund-policy',
    question: 'What is your refund policy?',
    answer: 'We offer refunds for unused credits within 30 days of purchase. Subscription refunds are prorated based on usage. Contact support for assistance with refund requests.',
  },
  {
    id: 'subscription-cancel',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes! You can cancel your subscription at any time from your account settings. You\'ll retain access to your subscription benefits until the end of your current billing period.',
  },
  {
    id: 'credit-sharing',
    question: 'Can I share credits with team members?',
    answer: 'Enterprise plans include team management features that allow credit sharing and allocation. Basic and Pro plans are individual accounts only.',
  },
  {
    id: 'payment-methods',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.',
  },
];

const Support: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Mock send process
    setTimeout(() => {
      setIsSending(false);
      setContactForm({ subject: '', message: '' });
      alert('Support ticket submitted successfully! We\'ll get back to you within 24 hours.');
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Support & Help</h2>
        <p className="text-gray-300">
          Find answers to common questions or contact our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FAQ Section */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <HelpCircle size={20} className="mr-2" />
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-white font-medium">{item.question}</span>
                  {expandedFAQ === item.id ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>
                
                {expandedFAQ === item.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <MessageCircle size={20} className="mr-2" />
            Contact Support
          </h3>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-highlight"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-highlight resize-none"
                  placeholder="Please provide as much detail as possible about your issue..."
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 px-4 bg-highlight hover:bg-highlight/90 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send size={18} />
                <span>{isSending ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center text-gray-300 text-sm">
                <Mail size={16} className="mr-2" />
                <span>Or email us directly at: </span>
                <a 
                  href="mailto:support@lelabs.com" 
                  className="text-highlight hover:underline ml-1"
                >
                  support@lelabs.com
                </a>
              </div>
              <p className="text-gray-400 text-xs mt-2">
                We typically respond within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support; 