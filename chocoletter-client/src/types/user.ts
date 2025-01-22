/**
 * 사용자 정보를 저장할 때 사용하는 타입
 */
export interface MyUserInfo {
    userId: string;
    accessToken: string;
  }
  
  /**
   * 로컬 스토리지에서 가져온 사용자 정보의 타입
   * 로컬 스토리지에서 가져올 때 값이 없을 수 있으므로, 각 필드는 string | null입니다.
   */
  export interface LocalMyUserInfo {
    userId: string | null;
    accessToken: string | null;
  }
  