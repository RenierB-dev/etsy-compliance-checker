'use client';

import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

interface ProductTourProps {
  isOpen: boolean;
  onComplete: () => void;
}

const steps: Step[] = [
  {
    target: '[data-tour="connect-shop"]',
    content: 'Start by connecting your Etsy shop via OAuth. This gives us permission to scan your listings.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '[data-tour="run-scan"]',
    content: 'Run your first compliance scan. We\'ll analyze all your listings against 50+ Etsy policies.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="violations-list"]',
    content: 'Review violations organized by severity - Critical, Warning, and Info levels.',
    placement: 'right',
  },
  {
    target: '[data-tour="auto-fix"]',
    content: 'Pro users can fix all violations with one click! Upgrade to save hours of manual editing.',
    placement: 'left',
  },
  {
    target: '[data-tour="monitoring"]',
    content: 'Enable daily monitoring to get instant email alerts when new violations are detected.',
    placement: 'top',
  },
];

export default function ProductTour({ isOpen, onComplete }: ProductTourProps) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    setRun(isOpen);
  }, [isOpen]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setRun(false);
      onComplete();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#ef711e',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
        },
        buttonNext: {
          backgroundColor: '#ef711e',
          borderRadius: 6,
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: 10,
        },
        buttonSkip: {
          color: '#6b7280',
        },
      }}
      locale={{
        last: 'Finish',
        skip: 'Skip Tour',
        next: 'Next',
        back: 'Back',
      }}
    />
  );
}
