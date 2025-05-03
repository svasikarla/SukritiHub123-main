export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      role_permissions: {
        Row: {
          id: string
          role_id: string
          permission_id: string
          created_at: string
        }
        Insert: {
          id?: string
          role_id: string
          permission_id: string
          created_at?: string
        }
        Update: {
          id?: string
          role_id?: string
          permission_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      },
      // Renamed from "Maid Attendance" to maid_attendance
      maid_attendance: {
        Row: {
          apartment_unit: string | null
          created_at: string
          entry_time: string | null
          exit_time: string | null
          face_match_confidence: number | null
          id: number
          maid_id: number | null
          status: string | null
        }
        Insert: {
          apartment_unit?: string | null
          created_at?: string
          entry_time?: string | null
          exit_time?: string | null
          face_match_confidence?: number | null
          id?: number
          maid_id?: number | null
          status?: string | null
        }
        Update: {
          apartment_unit?: string | null
          created_at?: string
          entry_time?: string | null
          exit_time?: string | null
          face_match_confidence?: number | null
          id?: number
          maid_id?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Maid Attendance_maid_id_fkey"
            columns: ["maid_id"]
            isOneToOne: false
            referencedRelation: "Maids"
            referencedColumns: ["id"]
          },
        ]
      }
      // Standardized column names
      Maids: {
        Row: {
          apartment_unit: string | null
          created_at: string
          face_descriptor: Json | null  // Consolidated from "Face Descriptor" and face_descriptor
          id: number
          name_of_maid: string | null   // Renamed from "Name of Maid"
          phone_number: string | null
        }
        Insert: {
          apartment_unit?: string | null
          created_at?: string
          face_descriptor?: Json | null
          id?: number
          name_of_maid?: string | null
          phone_number?: string | null
        }
        Update: {
          apartment_unit?: string | null
          created_at?: string
          face_descriptor?: Json | null
          id?: number
          name_of_maid?: string | null
          phone_number?: string | null
        }
        Relationships: []
      }
      // Renamed from "Night Patrol Beat" to night_patrol_beat
      night_patrol_beat: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      // Consolidated Guards (removed duplicate Guard table)
      Guards: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      residents: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          apartment_id: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email?: string | null
          apartment_id?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          apartment_id?: string | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "residents_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          }
        ]
      }
      apartments: {
        Row: {
          id: string
          block: string
          flat_number: string
          floor_number: number | null
          flat_type: string | null
          area_sqft: number | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          block: string
          flat_number: string
          floor_number?: number | null
          flat_type?: string | null
          area_sqft?: number | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          block?: string
          flat_number?: string
          floor_number?: number | null
          flat_type?: string | null
          area_sqft?: number | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
  auth: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          user_metadata: {
            name?: string
            avatar_url?: string
          }
        }
        Insert: {
          id: string
          email: string
          user_metadata?: {
            name?: string
            avatar_url?: string
          }
        }
        Update: {
          id?: string
          email?: string
          user_metadata?: {
            name?: string
            avatar_url?: string
          }
        }
        Relationships: []
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"])
    ? (PublicSchema["Tables"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
