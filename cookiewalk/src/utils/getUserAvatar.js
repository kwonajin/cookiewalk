import { supabase } from "../supabaseClient";

export default async function fetchAvatar(userID) {
try {
// 1. user_id를 사용하여 avatar를 가져옵니다.
const { data: userData, error: userError } = await supabase
.from('user')
.select('avatar')
.eq('user_id', userID)
.single();

if (userError) {
  throw userError;
}

const avatarId = userData.avatar;

// 2. avatar 값이 'avatar_No0'인 경우
if (avatarId === 'avatar_No0') {
  const defaultAvatarUrl = 'https://rbdbdnushdupstmiydea.supabase.co/storage/v1/object/public/image/avatar/No0_original.png';
  return defaultAvatarUrl;
}

// 3. avatar를 사용하여 source를 가져옵니다.
const { data: itemData, error: itemError } = await supabase
  .from('item')
  .select('source')
  .eq('item_id', avatarId)
  .single();

if (itemError) {
  throw itemError;
}

const imageUrl = itemData.source;

// 4. source URL을 그대로 리턴합니다.
return imageUrl;
} catch (error) {
console.error('Error fetching data:', error.message);
return null;
}
}