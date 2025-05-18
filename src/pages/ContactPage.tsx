import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone, ExternalLink } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    interest: 'general',
  });
  
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send data to a server
    console.log('Form data submitted:', formData);
    setSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        interest: 'general',
      });
      setSubmitted(false);
    }, 5000);
  };
  
  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-heading text-white mb-4">Contact / Collaboration</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Interested in collaborating on a project or learning more about our research? 
            Get in touch with our team.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="bg-gray-900 p-8">
              <h2 className="font-heading text-2xl mb-6">Send a Message</h2>
              
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-success/20 border border-success p-6 text-center"
                >
                  <h3 className="font-heading text-xl mb-3">Message Sent!</h3>
                  <p className="text-gray-300">
                    Thank you for your message. We'll get back to you as soon as possible.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-800 border-gray-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-800 border-gray-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 border-gray-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="interest" className="block text-gray-300 mb-2">
                      Interest
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border-gray-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="collaboration">Project Collaboration</option>
                      <option value="research">Research Partnership</option>
                      <option value="media">Media Inquiry</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-gray-800 border-gray-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
                  >
                    <Send size={18} className="mr-2" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-gray-900 p-8 mb-8">
              <h2 className="font-heading text-2xl mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="mt-1 mr-4 text-primary" />
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-gray-400 mb-1">
                      <a href="mailto:contact@p2enjoy.studio" className="hover:text-white transition-colors">
                        contact@p2enjoy.studio
                      </a>
                    </p>
                    <p className="text-gray-400">
                      <a href="mailto:ceo@p2enjoy.studio" className="hover:text-white transition-colors">
                        ceo@p2enjoy.studio
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="mt-1 mr-4 text-primary" />
                  <div>
                    <h3 className="font-medium mb-1">Location</h3>
                    <p className="text-gray-400">
                      P2Enjoy Studio<br />
                      122 rue Amelot<br />
                      75011 Paris, France
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="mt-1 mr-4 text-primary" />
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-gray-400">
                      <a href="tel:+33782718617" className="hover:text-white transition-colors">
                        +33 (0)7 82 71 86 17
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ExternalLink className="mt-1 mr-4 text-primary" />
                  <div>
                    <h3 className="font-medium mb-1">Online</h3>
                    <p className="text-gray-400 mb-1">
                      <a 
                        href="https://p2enjoy.studio" 
                        className="hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Website: p2enjoy.studio
                      </a>
                    </p>
                    <p className="text-gray-400">
                      <a 
                        href="https://portfolio.p2enjoy.studio" 
                        className="hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Portfolio: portfolio.p2enjoy.studio
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div
              className="p-8 text-white"
              style={{ backgroundColor: '#238C33' }}
            >
              <h2 className="font-heading text-2xl mb-4">Open Lab Hours</h2>
              <p className="mb-4">
                We host quarterly open lab events where we showcase our current research projects and prototypes.
              </p>
              <p className="mb-2"><strong>Next Open Lab Day:</strong></p>
              <p className="text-xl font-heading mb-4">May 15th, 2025</p>
              <p className="text-sm">
                Registration required due to limited capacity. 
                Contact us for details and to reserve your spot.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
