import { useState, useEffect } from 'react'
import UserHeader from '../../components/layout/UserHeader/UserHeader'
import Achievements from '../../components/common/Achievements/Achievements'
import Requests from '../../components/common/Requests/Requests'
import DailySchedule from '../../components/common/DailySchedule/DailySchedule'
import { mockRequests, mockAchievements } from './HomeLogged.mock.tsx'
import { apiFetch } from '../../services/api'
import { extractBase64FromAvatarUrl } from '../../utils/imageUtils'
import './HomeLogged.css'

interface PendingRequest {
  id: number
  name: string
  avatar?: string
}

interface AchievementsData {
  id: number
  title: string
  icon?: string
}

function HomeLogged() {
  const [requests, setRequests] = useState<PendingRequest[]>([])
  const [achievements, setAchievements] = useState<AchievementsData[]>([])
  const [mentorProfileId, setMentorProfileId] = useState<number | null>(null)
  const [activeProfileId, setActiveProfileId] = useState<number | null>(null)
  const [userRole, setUserRole] = useState<'MENTOR' | 'MENTEE'>('MENTEE')
  const [loading, setLoading] = useState(true)

  // 1. Resolve mentorProfileId + carrega dados reais com fallback automático
  useEffect(() => {
    const loadHomeData = async () => {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setRequests(mockRequests.map(r => ({ id: r.id, name: r.name })))
        setAchievements(mockAchievements)
        setLoading(false)
        return
      }

      // Resolve profileId do mentor
      let resolvedProfileId: number | null = null
      try {
        const userRes = await apiFetch(`/users/${userId}`)
        if (userRes.ok) {
          const data = await userRes.json()
          const profiles: any[] = Array.isArray(data.profiles) ? data.profiles : []
          const mentorProfile = profiles.find(p => p?.role?.toUpperCase() === 'MENTOR')
          const menteeProfile = profiles.find(p => p?.role?.toUpperCase() === 'MENTORADO')
          resolvedProfileId = mentorProfile?.id ?? null
          setMentorProfileId(resolvedProfileId)
          const isMentor = resolvedProfileId !== null
          setUserRole(isMentor ? 'MENTOR' : 'MENTEE')
          setActiveProfileId(isMentor ? resolvedProfileId : (menteeProfile?.id ?? null))
        }
      } catch {
        // segue para fallback
      }

      // Carrega solicitações pendentes — agora usa o profileId do mentor
      if (resolvedProfileId) {
        try {
          console.log(`[HomeLogged] Fetching pending requests for Mentor Profile ID: ${resolvedProfileId}`);
          const incomingRes = await apiFetch(`/mentorship-connections/mentor/${resolvedProfileId}/pending`)
          if (incomingRes.ok) {
            const data: any[] = await incomingRes.json()
            console.log('[HomeLogged] Raw pending requests data:', data);
            
            if (Array.isArray(data) && data.length > 0) {
              // Fetch details and avatars for each mentee
              const requestsWithDetails = await Promise.all(
                data.map(async (m) => {
                  console.log(`[HomeLogged] Processing request ID: ${m.id}, menteeProfileId: ${m.menteeProfileId}`);
                  
                  let menteeName = `Mentorado #${m.menteeProfileId}`;
                  let menteeAvatar: string | undefined = undefined;

                  if (!m.menteeProfileId) {
                    console.warn(`[HomeLogged] No menteeProfileId found in request object`, m);
                    return {
                      id: m.id,
                      name: menteeName,
                      avatar: menteeAvatar,
                    };
                  }

                  // Fetch mentee profile details using menteeProfileId
                  try {
                    const profileRes = await apiFetch(`/profiles/${m.menteeProfileId}`);
                    console.log(`[HomeLogged] Profile response status: ${profileRes.status}`);
                    
                    if (profileRes.ok) {
                      const profileData = await profileRes.json();
                      console.log(`[HomeLogged] Mentee profile data:`, profileData);
                      
                      // Try to get name from profile or user
                      if (profileData.user?.name) {
                        menteeName = profileData.user.name;
                        console.log(`[HomeLogged] Got mentee name from profile user: ${menteeName}`);
                      } else if (profileData.name) {
                        menteeName = profileData.name;
                        console.log(`[HomeLogged] Got mentee name from profile: ${menteeName}`);
                      }
                      
                      // Fetch avatar image using the menteeProfileId directly
                      try {
                        const imageRes = await apiFetch(`/profiles/image/${m.menteeProfileId}`);
                        console.log(`[HomeLogged] Image response status: ${imageRes.status}`);
                        
                        if (imageRes.ok) {
                          const imageData = await imageRes.json();
                          console.log(`[HomeLogged] Image data:`, imageData);
                          
                          if (imageData?.avatarUrl) {
                            try {
                              const parsed = JSON.parse(imageData.avatarUrl);
                              const avatarUrl = parsed.image_base64 || imageData.avatarUrl;
                              menteeAvatar = avatarUrl.startsWith('data:') 
                                ? avatarUrl 
                                : `data:image/png;base64,${avatarUrl}`;
                              console.log(`[HomeLogged] Avatar set for mentee profile ${m.menteeProfileId}`);
                            } catch {
                              const avatarUrl = String(imageData.avatarUrl);
                              menteeAvatar = avatarUrl.startsWith('data:') 
                                ? avatarUrl 
                                : `data:image/png;base64,${avatarUrl}`;
                              console.log(`[HomeLogged] Avatar set (non-JSON) for mentee profile ${m.menteeProfileId}`);
                            }
                          }
                        }
                      } catch (imgErr) {
                        console.error(`[HomeLogged] Error fetching avatar for mentee profile ${m.menteeProfileId}:`, imgErr);
                      }
                    } else {
                      console.error(`[HomeLogged] Failed to fetch mentee profile, status: ${profileRes.status}`);
                    }
                  } catch (err) {
                    console.error(`[HomeLogged] Error fetching mentee profile for ID ${m.menteeProfileId}:`, err);
                  }

                  const finalRequest = {
                    id: m.id,
                    name: menteeName,
                    avatar: menteeAvatar,
                  };
                  console.log(`[HomeLogged] Final request object:`, finalRequest);
                  return finalRequest;
                })
              );
              console.log('[HomeLogged] All requests with details:', requestsWithDetails);
              setRequests(requestsWithDetails);
            } else {
              console.log('[HomeLogged] No pending requests found');
              setRequests([])
            }
          } else {
            console.warn('[HomeLogged] Failed to fetch pending requests:', incomingRes.status);
            setRequests([])
          }
        } catch (err) {
          console.error('[HomeLogged] Error fetching pending requests:', err);
          setRequests([])
        }
      } else {
        console.log('[HomeLogged] User is not a mentor or mentorProfileId not resolved yet');
        setRequests([])
      }

      // Carrega conquistas do summary de gamificação
      try {
        const summaryRes = await apiFetch(`/gamification/users/${userId}/summary`)
        if (summaryRes.ok) {
          const summary = await summaryRes.json()
          const unlocked: AchievementsData[] = Array.isArray(summary?.unlockedAchievements)
            ? summary.unlockedAchievements
            : []
          if (unlocked.length > 0) {
            setAchievements(unlocked)
          } else {
            setAchievements(mockAchievements)
          }
        } else {
          setAchievements(mockAchievements)
        }
      } catch {
        setAchievements(mockAchievements)
      }

      setLoading(false)
    }

    loadHomeData()
  }, [])

  // 2. Accept/Decline → usa PATCH /mentorship-connections/{id}/accept?mentorUserId=
  const handleAccept = async (id: number) => {
    const userId = localStorage.getItem('userId')
    if (!userId) return

    console.log(`[HomeLogged] Accepting connection ID: ${id} for mentor user: ${userId}`);
    setRequests(prev => prev.filter(r => r.id !== id))
    try {
      const res = await apiFetch(`/mentorship-connections/${id}/accept?mentorUserId=${userId}`, {
        method: 'PATCH',
      })
      if (res.ok) {
        console.log('[HomeLogged] Connection accepted successfully');

        // Verificar capacidade do mentor após aceitar
        if (mentorProfileId) {
          try {
            const capacityRes = await apiFetch(`/mentorship-connections/mentor/${mentorProfileId}/capacity`)
            if (capacityRes.ok) {
              const capacity = await capacityRes.json()
              console.log('[HomeLogged] Mentor capacity after accepting:', capacity);

              // Se mentor atingiu a capacidade máxima, desativar o mentor
              if (capacity.currentMentees >= capacity.maxMentees) {
                console.log('[HomeLogged] Mentor reached max capacity, deactivating...');
                const deactivateRes = await apiFetch(`/profiles/${mentorProfileId}`, {
                  method: 'PUT',
                  body: JSON.stringify({ isActive: false })
                })

                if (deactivateRes.ok) {
                  console.log('[HomeLogged] Mentor successfully deactivated');
                  alert(`Parabéns! Você atingiu a capacidade máxima de ${capacity.maxMentees} mentorados. Seu perfil foi desativado automaticamente.`);
                } else {
                  console.error('[HomeLogged] Failed to deactivate mentor:', deactivateRes.status);
                }
              }
            }
          } catch (capacityErr) {
            console.error('[HomeLogged] Error checking mentor capacity:', capacityErr);
          }
        }
      } else {
        console.error('[HomeLogged] Failed to accept connection:', res.status);
      }
    } catch (err) {
      console.error('[HomeLogged] Error accepting connection:', err);
    }
  }

  const handleDecline = async (id: number) => {
    const userId = localStorage.getItem('userId')
    if (!userId) return

    console.log(`[HomeLogged] Rejecting connection ID: ${id} for mentor user: ${userId}`);
    setRequests(prev => prev.filter(r => r.id !== id))
    try {
      const res = await apiFetch(`/mentorship-connections/${id}/reject?mentorUserId=${userId}`, {
        method: 'PATCH',
      })
      if (!res.ok) console.error('[HomeLogged] Failed to reject connection:', res.status);
    } catch (err) {
      console.error('[HomeLogged] Error rejecting connection:', err);
    }
  }

  return (
      <div className={styles.homeLogged}>

        <UserHeader />

        <section className={styles.mainContent}>

          <Requests
            userRole={userRole}
            mentorRequests={userRole === 'MENTOR' ? requests : []}
            menteeAcceptedRequests={userRole === 'MENTEE' ? requests : []}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />

          <DailySchedule
            userRole={userRole}
            profileId={activeProfileId}
          />

        </section>

        <Achievements achievements={achievements} />

      </div>
  )
}

export default HomeLogged