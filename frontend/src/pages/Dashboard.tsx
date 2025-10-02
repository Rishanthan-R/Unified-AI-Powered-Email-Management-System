import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { emailService, Email } from '../services/emailService';
import { emailAccountService, EmailAccount } from '../services/emailAccountService';
import { productService, Product } from '../services/productService';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'emails' | 'accounts' | 'products'>('emails');
  const [emails, setEmails] = useState<Email[]>([]);
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await authService.getProfile();
        setUser(profile.user);
        await loadEmails();
        await loadAccounts();
        await loadProducts();
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, []);

  const loadEmails = async () => {
    try {
      const data = await emailService.getEmails({ limit: 50 });
      setEmails(data.emails || []);
    } catch (error) {
      console.error('Failed to load emails:', error);
    }
  };

  const loadAccounts = async () => {
    try {
      const data = await emailAccountService.getAccounts();
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts({ limit: 50 });
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleConnectGmail = async () => {
    try {
      const data = await emailAccountService.initiateGmailAuth();
      window.location.href = data.authUrl;
    } catch (error) {
      alert('Failed to connect Gmail');
    }
  };

  const handleConnectOutlook = async () => {
    try {
      const data = await emailAccountService.initiateOutlookAuth();
      window.location.href = data.authUrl;
    } catch (error) {
      alert('Failed to connect Outlook');
    }
  };

  const handleSyncEmails = async (accountId: string) => {
    setLoading(true);
    try {
      await emailService.syncEmails(accountId);
      await loadEmails();
      alert('Emails synced successfully');
    } catch (error) {
      alert('Failed to sync emails');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = async (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      await emailService.markAsRead(email.id);
      await loadEmails();
    }
  };

  const handleGenerateReply = async (emailId: string) => {
    setLoading(true);
    try {
      const result = await emailService.generateAutoReply(emailId);
      alert(`Auto-reply generated:\n\n${result.autoReply.generatedReply}`);
    } catch (error) {
      alert('Failed to generate auto-reply');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCatalog = async () => {
    if (!uploadFile) {
      alert('Please select a file');
      return;
    }

    setLoading(true);
    try {
      await productService.uploadCatalog(uploadFile);
      await loadProducts();
      setUploadFile(null);
      alert('Catalog uploaded successfully');
    } catch (error) {
      alert('Failed to upload catalog');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getSentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      default: return '😐';
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Unified Email Manager</h1>
        <div>
          <span style={styles.userName}>{user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>
      </header>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('emails')}
          style={activeTab === 'emails' ? {...styles.tab, ...styles.activeTab} : styles.tab}
        >
          Emails ({emails.length})
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          style={activeTab === 'accounts' ? {...styles.tab, ...styles.activeTab} : styles.tab}
        >
          Email Accounts ({accounts.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          style={activeTab === 'products' ? {...styles.tab, ...styles.activeTab} : styles.tab}
        >
          Product Catalog ({products.length})
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === 'emails' && (
          <div style={styles.emailsContainer}>
            <div style={styles.emailList}>
              <h2>Inbox</h2>
              {emails.length === 0 ? (
                <p style={styles.emptyMessage}>No emails yet. Connect an account and sync!</p>
              ) : (
                emails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => handleEmailClick(email)}
                    style={{
                      ...styles.emailItem,
                      ...(selectedEmail?.id === email.id ? styles.selectedEmail : {}),
                      ...(email.isRead ? {} : styles.unreadEmail)
                    }}
                  >
                    <div style={styles.emailHeader}>
                      <strong>{email.from}</strong>
                      <span style={styles.emailDate}>
                        {new Date(email.receivedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={styles.emailSubject}>{email.subject}</div>
                    <div style={styles.emailMeta}>
                      {email.aiPriority && (
                        <span style={{...styles.badge, backgroundColor: getPriorityColor(email.aiPriority)}}>
                          {email.aiPriority}
                        </span>
                      )}
                      {email.aiSentiment && (
                        <span style={styles.sentiment}>
                          {getSentimentEmoji(email.aiSentiment)} {email.aiSentiment}
                        </span>
                      )}
                      {email.aiIntent && (
                        <span style={styles.intent}>{email.aiIntent}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div style={styles.emailDetail}>
              {selectedEmail ? (
                <>
                  <h2>{selectedEmail.subject}</h2>
                  <div style={styles.emailDetailMeta}>
                    <p><strong>From:</strong> {selectedEmail.from}</p>
                    <p><strong>To:</strong> {selectedEmail.to}</p>
                    <p><strong>Date:</strong> {new Date(selectedEmail.receivedDate).toLocaleString()}</p>
                    <p><strong>Account:</strong> {selectedEmail.emailAccount?.email} ({selectedEmail.emailAccount?.provider})</p>
                  </div>
                  {selectedEmail.aiSummary && (
                    <div style={styles.aiSummary}>
                      <strong>AI Summary:</strong>
                      <p>{selectedEmail.aiSummary}</p>
                    </div>
                  )}
                  <div style={styles.emailBody}>
                    {selectedEmail.body}
                  </div>
                  <button
                    onClick={() => handleGenerateReply(selectedEmail.id)}
                    disabled={loading}
                    style={styles.button}
                  >
                    {loading ? 'Generating...' : 'Generate AI Reply'}
                  </button>
                </>
              ) : (
                <p style={styles.emptyMessage}>Select an email to view details</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div>
            <h2>Email Accounts</h2>
            <div style={styles.accountButtons}>
              <button onClick={handleConnectGmail} style={styles.button}>
                Connect Gmail
              </button>
              <button onClick={handleConnectOutlook} style={styles.button}>
                Connect Outlook
              </button>
            </div>
            <div style={styles.accountList}>
              {accounts.map((account) => (
                <div key={account.id} style={styles.accountItem}>
                  <div>
                    <strong>{account.email}</strong>
                    <span style={styles.badge}>{account.provider}</span>
                  </div>
                  <button
                    onClick={() => handleSyncEmails(account.id)}
                    disabled={loading}
                    style={styles.smallButton}
                  >
                    Sync
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <h2>Product Catalog</h2>
            <div style={styles.uploadSection}>
              <input
                type="file"
                accept=".csv,.json"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                style={styles.fileInput}
              />
              <button
                onClick={handleUploadCatalog}
                disabled={!uploadFile || loading}
                style={styles.button}
              >
                {loading ? 'Uploading...' : 'Upload Catalog'}
              </button>
            </div>
            <div style={styles.productList}>
              {products.map((product) => (
                <div key={product.id} style={styles.productItem}>
                  <h3>{product.productName}</h3>
                  {product.productSku && <p><strong>SKU:</strong> {product.productSku}</p>}
                  {product.description && <p>{product.description}</p>}
                  {product.price && <p><strong>Price:</strong> ${product.price}</p>}
                  {product.category && <span style={styles.badge}>{product.category}</span>}
                  <span style={{...styles.badge, backgroundColor: product.availability ? '#28a745' : '#dc3545'}}>
                    {product.availability ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.5rem',
  },
  userName: {
    marginRight: '1rem',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'white',
    color: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  tabs: {
    backgroundColor: 'white',
    display: 'flex',
    borderBottom: '1px solid #ddd',
  },
  tab: {
    padding: '1rem 2rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  activeTab: {
    borderBottom: '3px solid #007bff',
    fontWeight: 'bold',
  },
  content: {
    padding: '2rem',
  },
  emailsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '1rem',
  },
  emailList: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  emailItem: {
    padding: '1rem',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
  },
  unreadEmail: {
    backgroundColor: '#f0f8ff',
    fontWeight: 'bold',
  },
  selectedEmail: {
    backgroundColor: '#e7f3ff',
  },
  emailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  emailSubject: {
    marginBottom: '0.5rem',
  },
  emailMeta: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  emailDate: {
    color: '#666',
    fontSize: '0.9rem',
  },
  badge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    color: 'white',
    backgroundColor: '#6c757d',
  },
  sentiment: {
    fontSize: '0.85rem',
    color: '#666',
  },
  intent: {
    fontSize: '0.85rem',
    color: '#666',
    fontStyle: 'italic',
  },
  emailDetail: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  emailDetailMeta: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  aiSummary: {
    backgroundColor: '#e7f3ff',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  emailBody: {
    whiteSpace: 'pre-wrap',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  smallButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  accountButtons: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  accountList: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
  },
  accountItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #eee',
  },
  uploadSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  fileInput: {
    flex: 1,
  },
  productList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
  },
  productItem: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    padding: '2rem',
  },
};

export default Dashboard;
