import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import api from "../../services/api";

interface Genre {
  id: number;
  name: string;
}

export default function GenresScreen() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      const res = await api.get("/api/genres");
      setGenres(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const addGenre = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await api.post("/api/genres", { name: newName.trim() });
      setGenres((prev) => [...prev, res.data]);
      setNewName("");
    } catch (e) {
      alert("Thêm thất bại!");
    } finally {
      setAdding(false);
    }
  };

  const saveEdit = async () => {
    if (!editId || !editName.trim()) return;
    try {
      const res = await api.put(`/api/genres/${editId}`, {
        name: editName.trim(),
      });
      setGenres((prev) => prev.map((g) => (g.id === editId ? res.data : g)));
      setEditId(null);
      setEditName("");
    } catch (e) {
      alert("Cập nhật thất bại!");
    }
  };

  const deleteGenre = async (id: number, name: string) => {
    const confirm =
      Platform.OS === "web" ? window.confirm(`Xóa thể loại "${name}"?`) : true;
    if (!confirm) return;
    try {
      await api.delete(`/api/genres/${id}`);
      setGenres((prev) => prev.filter((g) => g.id !== id));
    } catch (e) {
      alert("Xóa thất bại!");
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý thể loại</Text>
      </View>

      {/* Add genre */}
      <View style={styles.addRow}>
        <TextInput
          style={styles.addInput}
          value={newName}
          onChangeText={setNewName}
          placeholder="Tên thể loại mới..."
          placeholderTextColor="#555"
          onSubmitEditing={addGenre}
        />
        <TouchableOpacity
          style={[styles.addBtn, adding && styles.addBtnDisabled]}
          onPress={addGenre}
          disabled={adding}
        >
          {adding ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="add" size={22} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={genres}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.genreItem}>
            {editId === item.id ? (
              <TextInput
                style={styles.editInput}
                value={editName}
                onChangeText={setEditName}
                autoFocus
                onSubmitEditing={saveEdit}
              />
            ) : (
              <Text style={styles.genreName}>{item.name}</Text>
            )}

            <View style={styles.actions}>
              {editId === item.id ? (
                <>
                  <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                    <Ionicons name="checkmark" size={18} color="#2ecc71" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setEditId(null);
                      setEditName("");
                    }}
                  >
                    <Ionicons name="close" size={18} color="#888" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => {
                      setEditId(item.id);
                      setEditName(item.name);
                    }}
                  >
                    <Ionicons name="pencil" size={18} color="#0984e3" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteGenre(item.id, item.name)}
                  >
                    <Ionicons name="trash" size={18} color="#E50914" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },

  addRow: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  addInput: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  addBtn: {
    backgroundColor: "#E50914",
    borderRadius: 8,
    width: 46,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnDisabled: { opacity: 0.6 },

  list: { padding: 16, gap: 10 },
  genreItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    padding: 14,
  },
  genreName: { flex: 1, color: "#fff", fontSize: 15, fontWeight: "500" },
  editInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E50914",
    paddingVertical: 2,
  },
  actions: { flexDirection: "row", gap: 8 },
  editBtn: {
    backgroundColor: "rgba(9,132,227,0.15)",
    borderRadius: 6,
    padding: 7,
  },
  deleteBtn: {
    backgroundColor: "rgba(229,9,20,0.15)",
    borderRadius: 6,
    padding: 7,
  },
  saveBtn: {
    backgroundColor: "rgba(46,204,113,0.15)",
    borderRadius: 6,
    padding: 7,
  },
  cancelBtn: {
    backgroundColor: "rgba(136,136,136,0.15)",
    borderRadius: 6,
    padding: 7,
  },
});
