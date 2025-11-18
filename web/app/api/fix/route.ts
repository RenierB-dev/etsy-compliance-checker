import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

/**
 * Auto-fix API endpoint
 * Applies suggested fixes to Etsy listings via Etsy API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, listingId, field, newValue, fixType } = body;

    if (!accessToken || !listingId) {
      return NextResponse.json(
        { error: 'Access token and listing ID are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ETSY_API_KEY;

    // Build update payload based on fix type
    let updateData: any = {};

    switch (fixType) {
      case 'remove_keyword':
        // Remove prohibited keyword from title/description/tags
        if (field === 'title') {
          updateData.title = newValue;
        } else if (field === 'description') {
          updateData.description = newValue;
        } else if (field === 'tags') {
          updateData.tags = newValue.split(',');
        }
        break;

      case 'add_materials':
        updateData.materials = newValue.split(',');
        break;

      case 'update_title':
        updateData.title = newValue;
        break;

      case 'update_description':
        updateData.description = newValue;
        break;

      case 'add_tags':
        updateData.tags = newValue.split(',');
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid fix type' },
          { status: 400 }
        );
    }

    // Update listing via Etsy API
    const response = await axios.patch(
      `https://openapi.etsy.com/v3/application/shops/{shop_id}/listings/${listingId}`,
      updateData,
      {
        headers: {
          'x-api-key': apiKey,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      success: true,
      listing: response.data,
    });
  } catch (error: any) {
    console.error('Fix error:', error);
    return NextResponse.json(
      { error: error.response?.data?.error || error.message || 'Failed to apply fix' },
      { status: 500 }
    );
  }
}
