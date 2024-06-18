import { useToken } from "../context/tokenContext";
import { supabase } from "../supabaseClient";

export default async function fetchAvatar() {
  const userInfo = useToken();
  const userID = userInfo.user;

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

    // 2. avatar를 사용하여 source를 가져옵니다.
    const { data: itemData, error: itemError } = await supabase
      .from('item')
      .select('source')
      .eq('item_id', avatarId)
      .single();

    if (itemError) {
      throw itemError;
    }

    const imageUrl = itemData.source;

    // 3. 이미지를 가져와서 Blob으로 변환합니다.
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();

    // 4. Blob을 파일로 변환합니다.
    const file = new File([blob], 'avatar.png', { type: blob.type });

    console.log('File:', file);
    return file;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }
}
