import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';

interface ProjectListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectListingModal: React.FC<ProjectListingModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [formData, setFormData] = useState({
    listingType: 'Free',
    email: '',
    projectDetails: '',
    relationship: '',
    launchDate: '',
    country: '',
    projectName: '',
    ticker: '',
    tags: '',
    description: '',
    keyPoints: '',
    network: 'ETH',
    logoLink: '',
    website: '',
    decimals: '18',
    blockExplorer: '',
    whitepaper: '',
    twitter: '',
    telegram: '',
    facebook: '',
    linkedin: '',
    icoStartDate: '',
    icoEndDate: '',
    launchPrice: '',
    comments: '',
    tokenAddress: ''
  });

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.projectName.trim()) return 'Project name is required';
    if (!formData.ticker.trim()) return 'Project ticker is required';
    if (!formData.description.trim()) return 'Project description is required';
    if (formData.description.length < 120) return 'Description must be at least 120 characters';
    if (!formData.website.trim()) return 'Project website is required';
    if (!formData.blockExplorer.trim()) return 'Block explorer link is required';
    if (!formData.whitepaper.trim()) return 'Whitepaper link is required';
    if (!formData.icoStartDate) return 'ICO start date is required';
    if (!formData.icoEndDate) return 'ICO end date is required';
    if (!formData.launchPrice.trim()) return 'Launch price is required';
    if (!formData.tokenAddress.trim()) return 'Token contract address is required';
    return null;
  };

  const determineStatus = () => {
    const now = new Date();
    const startDate = new Date(formData.icoStartDate);
    const endDate = new Date(formData.icoEndDate);
    
    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'active';
    return 'completed';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Submitting project data...', { user: user.email, formData });

      const projectData = {
        name: formData.projectName,
        description: formData.description,
        image_url: formData.logoLink || null,
        status: determineStatus(),
        website_url: formData.website,
        whitepaper_url: formData.whitepaper,
        email: user.email,
        listing_type: formData.listingType,
        project_details: formData.projectDetails,
        relationship: formData.relationship,
        launch_date: formData.launchDate || null,
        country: formData.country,
        ticker: formData.ticker,
        tags: formData.tags,
        key_points: formData.keyPoints,
        network: formData.network,
        decimals: parseInt(formData.decimals),
        block_explorer: formData.blockExplorer,
        twitter: formData.twitter,
        telegram: formData.telegram,
        facebook: formData.facebook,
        linkedin: formData.linkedin,
        ico_start_date: formData.icoStartDate,
        ico_end_date: formData.icoEndDate,
        launch_price: formData.launchPrice,
        comments: formData.comments,
        token_address: formData.tokenAddress
      };

      console.log('Project data to insert:', projectData);

      const { data, error: insertError } = await supabase
        .from('ico_projects')
        .insert([projectData])
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('Project inserted successfully:', data);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setFormData({
          listingType: 'Free',
          email: '',
          projectDetails: '',
          relationship: '',
          launchDate: '',
          country: '',
          projectName: '',
          ticker: '',
          tags: '',
          description: '',
          keyPoints: '',
          network: 'ETH',
          logoLink: '',
          website: '',
          decimals: '18',
          blockExplorer: '',
          whitepaper: '',
          twitter: '',
          telegram: '',
          facebook: '',
          linkedin: '',
          icoStartDate: '',
          icoEndDate: '',
          launchPrice: '',
          comments: '',
          tokenAddress: ''
        });
      }, 2000);
    } catch (err) {
      console.error('Error submitting project:', err);
      setError(`Failed to submit project: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>
          
          <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">List New Project</h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!user ? (
              <div className="p-8 text-center">
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Sign In Required
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You need to sign in to submit a project listing.
                </p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
                {error && (
                  <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg">
                    <p className="text-green-700 dark:text-green-400">Project submitted successfully!</p>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Listing Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      1. Select Listing Type
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Free', 'Silver', 'Gold'].map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="radio"
                            name="listingType"
                            value={type}
                            checked={formData.listingType === type}
                            onChange={handleChange}
                            className="mr-2 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Details [Project's full name] - [Symbol] - [Total Supply] - [Contract Address]
                    </label>
                    <textarea
                      name="projectDetails"
                      value={formData.projectDetails}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Example: MyCoin - MYC - 1,000,000,000 - 0x123..."
                    />
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      3. Relationship with the Project
                    </label>
                    <input
                      type="text"
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Founder, Team Member, Marketing Partner"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Launch Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        4. Project Launch Date
                      </label>
                      <input
                        type="date"
                        name="launchDate"
                        value={formData.launchDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        5. Country of Origin
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Where majority of team is located"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        6. Project Name *
                      </label>
                      <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Ticker */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        7. Project Ticker/Symbol *
                      </label>
                      <input
                        type="text"
                        name="ticker"
                        value={formData.ticker}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Do not put a $ sign if there is none"
                      />
                    </div>
                  </div>

                  {/* Token Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Token Contract Address *
                    </label>
                    <input
                      type="text"
                      name="tokenAddress"
                      value={formData.tokenAddress}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Enter the ERC-20 contract address for token analytics
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      8. Project Tags - Sector/Categories
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., DeFi, Gaming, NFT, Metaverse (comma separated)"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      9. Project Short Description * (minimum 120 characters)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formData.description.length}/120 characters minimum
                    </div>
                  </div>

                  {/* Key Points */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      10. Project Key-points
                    </label>
                    <textarea
                      name="keyPoints"
                      value={formData.keyPoints}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="List the main features and benefits of your project"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Network */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        11. Network *
                      </label>
                      <select
                        name="network"
                        value={formData.network}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="ETH">Ethereum (ETH)</option>
                        <option value="BNB">Binance Smart Chain (BNB)</option>
                        <option value="POL">Polygon (POL)</option>
                        <option value="ARB">Arbitrum (ARB)</option>
                        <option value="BASE">Base</option>
                        <option value="BLAST">Blast</option>
                      </select>
                    </div>

                    {/* Decimals */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Number of Decimals *
                      </label>
                      <input
                        type="number"
                        name="decimals"
                        value={formData.decimals}
                        onChange={handleChange}
                        required
                        min="0"
                        max="18"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo Link */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        12. Link to Logo
                      </label>
                      <input
                        type="url"
                        name="logoLink"
                        value={formData.logoLink}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        13. Project Website *
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://yourproject.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Block Explorer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Block Explorer Link *
                      </label>
                      <input
                        type="url"
                        name="blockExplorer"
                        value={formData.blockExplorer}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://etherscan.io/token/0x..."
                      />
                    </div>

                    {/* Whitepaper */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Whitepaper / Technical Documentation Link *
                      </label>
                      <input
                        type="url"
                        name="whitepaper"
                        value={formData.whitepaper}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://yourproject.com/whitepaper.pdf"
                      />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Social Links *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="url"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="X (Twitter) URL"
                      />
                      <input
                        type="url"
                        name="telegram"
                        value={formData.telegram}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Telegram URL"
                      />
                      <input
                        type="url"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Facebook URL"
                      />
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="LinkedIn URL"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ICO Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ICO/IEO Start Date *
                      </label>
                      <input
                        type="date"
                        name="icoStartDate"
                        value={formData.icoStartDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* ICO End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ICO/IEO End Date *
                      </label>
                      <input
                        type="date"
                        name="icoEndDate"
                        value={formData.icoEndDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Launch Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ICO/IEO/Launch Price [Price/Native Currency] *
                    </label>
                    <input
                      type="text"
                      name="launchPrice"
                      value={formData.launchPrice}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., 0.001 ETH or $0.10"
                    />
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Comments and/or Questions
                    </label>
                    <textarea
                      name="comments"
                      value={formData.comments}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Any additional information or questions you'd like to share"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all transform hover:scale-105 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      'Submit Project'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        initialMode="signin"
      />
    </>
  );
};

export default ProjectListingModal;