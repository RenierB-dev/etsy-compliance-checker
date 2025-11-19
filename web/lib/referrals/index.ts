import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Generate a unique referral code for a user
 */
export function generateReferralCode(userName: string): string {
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  const namePrefix = userName
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 4)
    .toUpperCase();
  return `${namePrefix}${randomString}`;
}

/**
 * Create a referral code for a user
 */
export async function createReferralCode(userId: string, userName: string) {
  try {
    // Check if user already has a referral code
    const { data: existing } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existing) {
      return { success: true, code: existing.code };
    }

    // Generate new code
    let code = generateReferralCode(userName);
    let attempts = 0;
    let codeExists = true;

    // Ensure code is unique
    while (codeExists && attempts < 5) {
      const { data } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('code', code)
        .single();

      if (!data) {
        codeExists = false;
      } else {
        code = generateReferralCode(userName);
        attempts++;
      }
    }

    // Create referral code
    const { data, error } = await supabase
      .from('referral_codes')
      .insert({
        user_id: userId,
        code,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating referral code:', error);
      return { success: false, error };
    }

    return { success: true, code: data.code };
  } catch (error) {
    console.error('Referral code creation error:', error);
    return { success: false, error };
  }
}

/**
 * Apply a referral code when a new user signs up
 */
export async function applyReferralCode(
  referralCode: string,
  newUserId: string
) {
  try {
    // Find the referral code
    const { data: codeData, error: codeError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', referralCode)
      .single();

    if (codeError || !codeData) {
      return { success: false, error: 'Invalid referral code' };
    }

    // Don't allow self-referrals
    if (codeData.user_id === newUserId) {
      return { success: false, error: 'Cannot use your own referral code' };
    }

    // Create referral record
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: codeData.user_id,
        referred_id: newUserId,
        code: referralCode,
        status: 'pending',
      })
      .select()
      .single();

    if (referralError) {
      console.error('Error creating referral:', referralError);
      return { success: false, error: referralError };
    }

    // Update code usage count
    await supabase
      .from('referral_codes')
      .update({
        uses_count: codeData.uses_count + 1,
      })
      .eq('code', referralCode);

    return { success: true, referral };
  } catch (error) {
    console.error('Apply referral error:', error);
    return { success: false, error };
  }
}

/**
 * Mark referral as completed and apply credits
 */
export async function completeReferral(referralId: string) {
  try {
    // Get referral details
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select('*')
      .eq('id', referralId)
      .single();

    if (referralError || !referral) {
      return { success: false, error: 'Referral not found' };
    }

    if (referral.credit_applied) {
      return { success: false, error: 'Credit already applied' };
    }

    // Update referral status
    const { error: updateError } = await supabase
      .from('referrals')
      .update({
        status: 'completed',
        credit_applied: true,
      })
      .eq('id', referralId);

    if (updateError) {
      console.error('Error updating referral:', updateError);
      return { success: false, error: updateError };
    }

    // Here you would integrate with Stripe to apply credits
    // For example: extend subscription by 1 month for both referrer and referred

    return { success: true };
  } catch (error) {
    console.error('Complete referral error:', error);
    return { success: false, error };
  }
}

/**
 * Get referral statistics for a user
 */
export async function getReferralStats(userId: string) {
  try {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId);

    if (error) {
      console.error('Error fetching referral stats:', error);
      return { success: false, error };
    }

    const stats = {
      total: referrals?.length || 0,
      pending: referrals?.filter((r) => r.status === 'pending').length || 0,
      completed: referrals?.filter((r) => r.status === 'completed').length || 0,
      creditsEarned: referrals?.filter((r) => r.credit_applied).length || 0,
    };

    return { success: true, stats };
  } catch (error) {
    console.error('Get referral stats error:', error);
    return { success: false, error };
  }
}
