import React from 'react';

export function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl tracking-wider mb-8">SHIPPING POLICY</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2>Shipping Methods</h2>
            <p>
              We offer reliable shipping across India through trusted courier partners. 
              All orders are carefully packed and dispatched within 2-3 business days.
            </p>
          </section>

          <section>
            <h2>Delivery Time</h2>
            <p>
              Standard delivery typically takes 5-7 business days. For metro cities, 
              delivery may be faster (3-5 business days).
            </p>
          </section>

          <section>
            <h2>Shipping Charges</h2>
            <ul>
              <li>Orders above ₹1000: FREE shipping</li>
              <li>Orders below ₹1000: ₹50 shipping charge</li>
            </ul>
          </section>

          <section>
            <h2>Order Tracking</h2>
            <p>
              Once your order is shipped, you will receive a tracking number via 
              email/SMS to monitor your delivery status.
            </p>
          </section>

          <section>
            <h2>Delivery Issues</h2>
            <p>
              If you face any delivery issues or delays, please contact our customer 
              support team, and we'll resolve it promptly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl tracking-wider mb-8">RETURN & REFUND POLICY</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2>Return Eligibility</h2>
            <p>
              We accept returns within 7 days of delivery if the product is unused, 
              in original packaging, and with all tags intact.
            </p>
          </section>

          <section>
            <h2>Non-Returnable Items</h2>
            <ul>
              <li>Earrings (for hygiene reasons)</li>
              <li>Customized or personalized jewellery</li>
              <li>Products damaged due to misuse</li>
            </ul>
          </section>

          <section>
            <h2>Return Process</h2>
            <ol>
              <li>Contact our support team with your order number and reason for return</li>
              <li>Ship the product back to our address (shipping cost to be borne by customer)</li>
              <li>Once received and verified, refund will be processed within 7-10 business days</li>
            </ol>
          </section>

          <section>
            <h2>Refund Method</h2>
            <p>
              Refunds will be credited to the original payment method. For COD orders, 
              refund will be processed via bank transfer.
            </p>
          </section>

          <section>
            <h2>Exchange Policy</h2>
            <p>
              We offer one-time exchange for size/design issues within 7 days of delivery. 
              Contact us to initiate an exchange.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl tracking-wider mb-8">PRIVACY POLICY</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2>Information We Collect</h2>
            <p>
              We collect personal information (name, email, phone, address) when you place 
              an order or contact us. This information is used solely for order processing 
              and customer support.
            </p>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <ul>
              <li>To process and fulfill your orders</li>
              <li>To communicate about order status and updates</li>
              <li>To provide customer support</li>
              <li>To improve our products and services</li>
            </ul>
          </section>

          <section>
            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. 
              Payment information is processed through secure payment gateways and is not 
              stored on our servers.
            </p>
          </section>

          <section>
            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or share your personal information with third parties 
              except as required to fulfill your order (shipping partners) or as required by law.
            </p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. You can choose 
              to disable cookies in your browser settings.
            </p>
          </section>

          <section>
            <h2>Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. 
              Contact us if you wish to exercise these rights.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our privacy policy, please contact us at 
              info@rivayajewellery.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
