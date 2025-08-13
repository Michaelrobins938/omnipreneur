// components/novus/UpgradeGate.tsx
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import CheckoutButton from '../../app/components/CheckoutButton';

interface UpgradeGateProps {
  remaining: number;
  limit: number;
  onUpgrade: () => void;
}

export default function UpgradeGate({
  remaining,
  limit,
  onUpgrade
}: UpgradeGateProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Emit analytics event when component mounts
  useEffect(() => {
    // In a real implementation, you would emit an analytics event here
    console.log('novus_upgrade_viewed');
  }, []);

  const isFreeTier = limit > 0; // Free tier has a limit, Pro/Enterprise don't
  const usagePercentage = limit > 0 ? (1 - remaining / limit) * 100 : 0;

  return (
    <div className="bg-zinc-800/30 rounded-2xl p-4 border border-zinc-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {remaining > 0 ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          )}
          <div>
            <p className="text-white font-medium">
              {isFreeTier ? (
                <>
                  Free Tier: {remaining} of {limit} runs remaining
                </>
              ) : (
                'Pro Plan: Unlimited access'
              )}
            </p>
            {isFreeTier && (
              <div className="w-32 h-2 bg-zinc-700 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-purple-500"
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
        
        {isFreeTier && (
          <div className="flex items-center space-x-2">
            {remaining === 0 && (
              <Button
                onClick={() => setShowUpgrade(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm"
              >
                Upgrade to Pro
              </Button>
            )}
          </div>
        )}
      </div>

      {showUpgrade && (
        <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Upgrade to NOVUS Pro</h3>
            <Button
              onClick={() => setShowUpgrade(false)}
              variant="ghost"
              className="text-zinc-400 hover:text-white"
            >
              Close
            </Button>
          </div>
          
          <CheckoutButton
            productName="NOVUS Protocol Pro"
            productId="novus-pro"
            price={{
              monthly: 79,
              yearly: 790
            }}
            features={[
              "Unlimited optimizations",
              "Advanced CAL™ features",
              "Custom templates",
              "Priority support",
              "API access"
            ]}
            onClick={() => {
              // Emit analytics event
              console.log('checkout_initiated');
              onUpgrade();
            }}
          />
        </div>
      )}
    </div>
  );
}